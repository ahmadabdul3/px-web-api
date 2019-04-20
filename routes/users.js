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
  models.user.createOrGetExisting({ user }).then(user => {
    res.json({ user, message: '' });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error creating user' });
  });
}

// function patchUser(req, res) {
//   const { user } = req.body;
//   const dbUser = req.user;
//   const { id } = dbUser;
//
//   // - if the user object has a deviceId field it means we're trying to store a
//   //   device id. If the user from the db already has a deviceid that's identical
//   //   to the incoming deviceid, this is a no op - we just respond back with success
//   if (user.deviceId && (dbUser.deviceId === user.deviceId)) {
//     res.json({ message: 'success', status: 'success', user: dbUser });
//     return;
//   }
//
//   models.user.update(user, {
//     where: { id },
//     returning: true,
//   }).then(userRes => {
//     res.json({ message: 'success', status: 'success', user: userRes });
//   }).catch(e => {
//     console.log('ERROR UPDATING USER', e);
//     res.status(422).json({ status: 'fail', message: 'error updating user', e });
//   });
// }
