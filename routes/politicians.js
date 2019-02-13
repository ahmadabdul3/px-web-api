import express from 'express';
import models from 'src/db/models';

const { politician } = models;
const router = express.Router();

router.get('/', getPoliticians);
router.post('/', createPolitician);
router.put('/', updatePolitician);

export default router;

function getPoliticians(req, res) {
  politician.findAllWithRelations().then(r => {
    const politicians = r.map(p => politician.normalizedForUi(p));
    res.json({ status: 'success', politicians });
  }).catch(err => {
    console.log(err);
    res.json({ status: 'fail', err });
  });
}

function createPolitician(req, res) {
  politician.findDuplicates(req.body).then(r => {
    if (r.length < 1) {
      politician.createWithRelations(req.body).then(createResult => {
        const message = 'successfully created a new politician';
        res.json({ message, politician: createResult });
      }).catch(err => {
        console.log('error', err);
        res.status(422).json({ status: 'fail', message: err });
      });

      return;
    }

    const politicians = r.map(p => politician.normalizedForUi(p));
    res.status(409).json({
      status: 'fail',
      message: 'A duplicate office holder was found',
      data: politicians,
    });
  }).catch(err => {
    res.status(422).json({ status: 'fail', message: err });
  });
}

function updatePolitician(req, res) {
  politician.updateWithRelations(req.body).then(updateResult => {
    const message = 'successfully updated politician';
    res.json({ message, politician: updateResult });
  }).catch(err => {
    console.log('error', err);
    res.status(422).json({ status: 'fail', message: err });
  });
}
