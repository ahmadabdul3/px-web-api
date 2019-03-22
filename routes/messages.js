import express from 'express';
const router = express.Router();
import models from 'src/db/models';
import { messageStatus } from 'src/constants/messaging';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', createMessage);

export default router;

function createMessage(req, res) {
  const { message } = req.body;
  message.status = messageStatus.NEW_UNOPENED;
  models.message.create(message).then(messageRes => {
    res.json({ messageData: messageRes, message: 'success' });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error creating message' });
  });
}
