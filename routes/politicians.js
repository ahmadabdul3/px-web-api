import express from 'express';
import models from 'src/db/models';

const router = express.Router();

router.get('/politicians', getPoliticians);
router.post('/politicians', createPolitician);

export default router;

function getPoliticians(req, res) {
  models.politician.findAllWithRelations().then(r => {
    const politicians = r.map(p => models.politician.normalizedForUi(p));
    res.json({ status: 'success', politicians });
  }).catch(err => {
    res.json({ status: 'fail', err });
  });
}

function createPolitician(req, res) {
  models.politician.findDuplicates(req.body).then(r => {
    if (r.length < 1) {
      res.json({ status: 'success', message: 'created successfully' });
      return;
    }

    const politicians = r.map(p => models.politician.normalizedForUi(p));
    res.status(409).json({
      status: 'fail',
      message: "There's already an office holder for that position",
      data: politicians,
    });
  }).catch(err => {
    res.json({ status: 'fail', message: err });
  });
}
