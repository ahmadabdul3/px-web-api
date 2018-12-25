import express from 'express';
import path from 'path';
const router = express.Router();
import models from 'src/db/models';
import fetch from 'node-fetch';
import prepPoliticianModelForUi from 'src/services/ui_data_prep/ui_data_prepper_politician';

router.get('/politicians', (req, res) => {
  models.politician.findAll({
    include: [{
      model: models.officeHolderTerm,
      include: [{
        model: models.contactInfo
      }],
    }]
  }).then(r => {
    const politicians = r.map((p, i) => {
      const politician = p.get({ plain: true });
      const officeHolderTerm = politician.officeHolderTerms[0];
      const contactInfo = officeHolderTerm.contactInfos[0];

      return prepPoliticianModelForUi({
        ...politician,
        ...officeHolderTerm,
        ...contactInfo,
        id: politician.id,
      });
    });
    res.json({ status: 'success', politicians });
  }).catch(err => {
    res.json({ status: 'fail', err });
  });
});

router.post('/politicians', (req, res) => {
  const {
    levelOfResponsibility,
    areaOfResponsibility,
    city,
    state,
    titlePrimary
  } = req.body;

  console.log('body', req.body);

  models.politician.findAll({
    include: [{
      model: models.officeHolderTerm,
      required: true,
      where: { levelOfResponsibility, areaOfResponsibility, titlePrimary },
      include: [{
        model: models.contactInfo,
        required: true,
        where: { city, state },
      }],
    }],
  }).then(r => {
    if (r.length < 1) {
      res.json({ status: 'success', message: 'created successfully' });
      return;
    }

    const politicians = r.map((p, i) => {
      const politician = p.get({ plain: true });
      const officeHolderTerm = politician.officeHolderTerms[0];
      const contactInfo = officeHolderTerm.contactInfos[0];

      return prepPoliticianModelForUi({
        ...politician,
        ...officeHolderTerm,
        ...contactInfo,
        id: politician.id,
      });
    });
    res.status(409).json({
      status: 'fail',
      message: "There's already an office holder for that position",
      data: politicians,
    });
  }).catch(err => {
    res.json({ status: 'fail', message: err });
  });
});

router.post('/alders', (req, res) => {
  models.official.create(req.body).then((sqlRes) => {
    res.json({ status: 'success' });
  }).catch((err) => {
    res.json({ status: 'fail', err });
  });
});

router.post('/alders/bulk-create', (req, res) => {
  models.official.bulkCreate(req.body).then((sqlRes) => {
    res.json({ status: 'success' });
  }).catch((err) => {
    res.json({ status: 'fail', err });
  });
});

router.get('/address', (req, res) => {
  // getPlaceId(req.query.address).then(response => {
  //   // console.log(response);
  //   // res.json(response);
  //   return response;
  // }).then(response => {
  //   const { candidates } = response;
  //   if (candidates.length > 0) return candidates[0].geometry;
  //   else res.json({ status: 'err', message: 'place not found' });
  // }).then(geometry => {
  //   return getWardInfo(geometry);
  // }).then(details => {
  //   res.json({ status: 'success', data: details });
  // }).catch(err => {
  //   console.log(err);
  //   res.json({ status: 'err' , message: err });
  // });
  getInfo(req.query.address)
    .then(response => {
      res.json({ status: 'success', data: response });
    }).catch(err => {
      console.log(err);
      res.json({ status: 'fail', data: err });
    });
});

const apikey = `AIzaSyBGw0mWKck6f5wkqE4HMZ3h4KoIq0LD96w`;

function getInfo(address) {
  const urlStart = 'https://content.googleapis.com/civicinfo/v2/representatives?'
  const addresss = `address=${address}`;
  const key = `&key=${apikey}`;
  const url = urlStart + addresss + key;

  return fetch(url)
    .then(res => res.json())
    .then((res) => res)
    .catch(err => err);
}

function getPlaceId(address) {
  const urlStart = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?`;
  const input = `input=${address}`
  const urlEnd = `&inputtype=textquery&fields=place_id,geometry&key=${apikey}`;
  const url = `${urlStart}${input}${urlEnd}`;

  return fetch(url)
    .then(res => res.json())
    .then(res => res)
    .catch(err => {
      console.log(err);
      return err;
    });
}

function getWardInfo(geometry) {
  return fetch(getMapUrl(geometry.location))
    .then(res => res.json())
    .then(res => res)
    .catch(err => {
      console.log(err);
      return err;
    });
}

function getMapUrl({ lat, lng }) {
  console.log('LAT', lat);
  console.log('LNG', lng);
  const urlParts = [
    `https://nhgis.newhavenct.gov/server/rest/services/Web_Services/New_Haven_Wards/MapServer/0/`,
    `query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&`,
    `geometry=%7B%22`,
    `xmin%22%3A${lat}%2C%22`,
    `ymin%22%3A${lng}%2C%22`,
    `xmax%22%3A${lat + 1}%2C%22`,
    `ymax%22%3A${lng + 1}%2C%22`,
    `spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryEnvelope`,
    `&inSR=102100&outFields=OBJECTID`,
    `%2CWARDS%2CWarrds_txt%2CWards_desc%2CAlder%2CLCI_Ward_Group%2CORIG_FID`,
    `%2CAlder_addr%2CAlder_City%2CAlder_Zip%2CAlder_img%2CAlder_Bio%2CAlder_email%2CAlder_phone`,
    `&outSR=102100`,
  ];
  return urlParts.join('');
}

function getPlaceDetails(placeId) {
  const urlStart = 'https://maps.googleapis.com/maps/api/place/details/json?';
  const place = `placeid=${placeId}`
  const urlEnd = `&fields=address_components,name,rating,formatted_phone_number&key=${apikey}`;
  const url = `${urlStart}${place}${urlEnd}`;

  return fetch(url)
    .then(res => res.json())
    .then(res => res)
    .catch(err => {
      console.log(err);
      return err;
    });
}

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

module.exports = router;

  //
  // {
  //  "ocdId": "ocd-division/country:us/state:ct/place:new_haven/ward:1",
  //  "name": "New Haven CT ward 1"
  // },

  //
  // committee = {
  //
  // }
  //
  // politician = {
  //   committeeId <- depends on them holding officeHolderTerm
  //
  // }
  //
  // committeeTitle = {
  //   committeeId
  //   officeHolderTermId
  //
  // }
