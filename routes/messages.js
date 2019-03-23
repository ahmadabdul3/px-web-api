import express from 'express';
const router = express.Router();
import models from 'src/db/models';

router.get('/', getMessages);
router.post('/', createMessage);

export default router;

function getMessages(req, res) {
  const { userId } = req.query;
  models.message.getLatestForAllThreads({ userId }).then(messageRes => {
    res.json({ messageData: messageRes, message: 'success' });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error fetching messages' });
  });
}

function createMessage(req, res) {
  const { message } = req.body;
  if (
    !message.senderId
    || !message.receiverId
    || !message.title
    || !message.body
  ) {
    res.status(422).json({ message: 'error creating message' });
    return;
  }
  models.message.create(message).then(messageRes => {
    res.json({ messageData: messageRes, message: 'success' });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error creating message' });
  });
}
