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

  Promise.resolve().then(() => {
    if (message.parentId) return models.message.create(message);
    return validateNumOfMessages({ req, message });
  }).then(messageRes => {
    return models.message.getLatestForAllThreads({ userId: message.senderId });
  }).then(messageRes => {
    res.json({ messageData: messageRes, message: 'success' });
  }).catch(e => {
    console.log('e', e);
    const responseToClient = { error: e, message: 'error creating message' };
    if (e.name === 'MessageLimitReached') {
      responseToClient.friendlyMessage = `You've reached the monthly cap of 3 'new' messages.`
        + ` However, you can continue sending messages in conversations that you've already started`
        + ` in your messages page.`;
    }
    res.status(422).json(responseToClient);
  });
}

function validateNumOfMessages({ req, message }) {
  return models.message.findAll({
    limit: 3,
    where: { senderId: req.user.id, parentId: { $eq: null } },
    order: [[ 'createdAt', 'DESC' ]]
  }).then(messages => {
    let numMessagesSent = 0;
    const thisMonth = (new Date()).getMonth();
    messages.forEach(message => {
      if (message.dataValues.createdAt.getMonth() === thisMonth) numMessagesSent++;
    });
    if (numMessagesSent > 2) throw({ name: 'MessageLimitReached', message: 'message limit reached' });
    return models.message.create(message);
  });
}
