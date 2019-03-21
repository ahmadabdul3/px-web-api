import express from 'express';
const router = express.Router();
import models from 'src/db/models';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', createUser);

export default router;

function createUser(req, res) {
  const { user } = req.body;
  models.user.create(user).then(newUser => {
    res.json({ user: newUser, message: 'successfully created' });
  }).catch(e => {
    res.status(402).json({ message: 'error creating user' });
  });
}
