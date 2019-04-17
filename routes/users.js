import express from 'express';
import models from 'src/db/models';
import { authenticateLenient } from 'src/services/authentication';

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// - have to protect these routes
// - can make the app a 'user' with certain previledges
router.post('/', createUser);
router.patch('/', authenticateLenient(), patchUser);

export default router;

function createUser(req, res) {
  const { user } = req.body;
  models.user.createOrGetExisting({ user }).then(userRes => {
    res.json({ user: userRes.user, message: userRes.status });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error creating user' });
  });
}

function patchUser(req, res) {
  const { user } = req.body;
  const dbUser = req.user;
  const { id } = dbUser;

  models.user.update(user, {
    where: { id },
    returning: true,
  }).then(userRes => {
    res.json({ message: 'success', status: 'success' });
  }).catch(e => {
    console.log('ERROR UPDATING USER', e);
    res.status(422).json({ status: 'fail', message: 'error updating user', e });
  });
}
