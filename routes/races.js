import express from 'express';
import models from 'src/db/models';
import { getAddressInfo } from 'src/services/address_manager';

const { race } = models;
const router = express.Router();

router.get('/location', getRacesForLocation);

export default router;

function getRacesForLocation(req, res) {
  const { city, state, district } = req.query;
  let location = {};
  let methodToCall = race.findAllWithRelations;
  if (district !== 'DISTRICT_NOT_FOUND') {
    methodToCall = race.findAllWithRelationsForLocation;
    location = { city, state, district };
  }

  methodToCall({ location }).then(resp => {
    const races = resp.map(r => r.get({ raw: true }));
    res.json({ status: 'success', races });
  }).catch(err => {
    console.log(err);
    res.json({ status: 'fail', err });
  });
}
