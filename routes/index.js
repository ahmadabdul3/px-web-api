import express from 'express';
import path from 'path';
const router = express.Router();
import models from 'src/db/models';
import fetch from 'node-fetch';

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
  getPlaceId(req.query.address).then(response => {
    // console.log(response);
    // res.json(response);
    return response;
  }).then(response => {
    const { candidates } = response;
    if (candidates.length > 0) return candidates[0].place_id;
    else res.json({ status: 'err', message: 'place not found' });
  }).then(placeId => {
    return getPlaceDetails(placeId);
  }).then(details => {
    res.json({ status: 'success', data: details });
  }).catch(err => {
    // console.log(err);
    res.json({ status: 'err' , message: err });
  });
});

const apikey = `AIzaSyBGw0mWKck6f5wkqE4HMZ3h4KoIq0LD96w`;

function getPlaceId(address) {
  const urlStart = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?`;
  const input = `input=${address}`
  const urlEnd = `&inputtype=textquery&fields=place_id&key=${apikey}`;
  const url = `${urlStart}${input}${urlEnd}`;

  return fetch(url)
    .then(res => res.json())
    .then(res => res)
    .catch(err => {
      console.log(err);
      return err;
    });
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
