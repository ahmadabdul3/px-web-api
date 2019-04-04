import express from 'express';
const router = express.Router();
import models from 'src/db/models';
import { authenticateLenient } from 'src/services/authentication';

router.get('/', authenticateLenient, getMessages);
router.get('/thread/:threadId', authenticateLenient, getMessagesForThread);
router.post('/', authenticateLenient, createMessage);

export default router;

function getMessages(req, res) {
  // const { userId } = req.query;
  const { auth0Id } = req;
  console.log('auth0i', auth0Id);
  models.user.findOne({ where: { auth0Id }}).then(user => {
    if (!user) throw ({ message: 'User with id ' + auth0Id + ' does not exist' });
    console.log('user', user);
    const userId = user.dataValues.id;
    console.log('user id', userId);
    return models.message.getLatestForAllThreads({ userId });
  }).then(messageRes => {
    res.json({ messageData: messageRes, message: 'success' });
  }).catch(e => {
    console.log('e', e);
    res.status(422).json({ message: 'error fetching messages', e });
  });
}

function getMessagesForThread(req, res) {
  const { threadId } = req.params;
  models.message.getForThread({ threadId }).then(messageRes => {
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
