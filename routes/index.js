import express from 'express';
import path from 'path';
const router = express.Router();
import models from 'src/db/models';

router.post('/alders', (req, res) => {
  console.log('req.body', req.body);
  console.log(models.official.attributes);
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

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

module.exports = router;
