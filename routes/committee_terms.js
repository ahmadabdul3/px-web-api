import express from 'express';
import models from 'src/db/models';
import {
  isSequelizeError,
  makeErrorsFriendly
} from 'src/services/sequelize_error_transformer';
import { authenticateStrict } from 'src/services/authentication';

const router = express.Router();

router.get('/', authenticateStrict, getCommitteeTerms);
router.post('/', authenticateStrict, createCommitteeTerm);

export default router;

function getCommitteeTerms(req, res) {
  models.politician.findAllWithRelations().then(r => {
    const politicians = r.map(p => models.politician.normalizedForUi(p));
    res.json({ status: 'success', politicians });
  }).catch(err => {
    res.json({ status: 'fail', err });
  });
}

function createCommitteeTerm(req, res) {
  const committeeTerm = req.body;
  models.committeeTerm.validateRelationUniqueness(req.body).then(() => {
    return models.committeeTerm.validateTitleUniqueness(req.body);
  }).then(() => {
    return models.committeeTerm.create(req.body);
  }).then(committeeTerm => {
    res.json({ message: 'success', committeeTerm });
  }).catch(e => {
    console.log('ERROR', e);
    if (isSequelizeError(e)) {
      const errors = makeErrorsFriendly(e);
      res.status(422).json({ errors });
      return;
    }

    res.status(500).json({ e, message: 'error' });
  });
}
