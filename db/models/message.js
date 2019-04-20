'use strict';
import { messageStatus } from 'src/constants/messaging';
import models from 'src/db/models';
import { sendPushNotifications } from 'src/services/push_notification_manager';

module.exports = (sequelize, DataTypes) => {
  const messageModel = sequelize.define('message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
    senderId: DataTypes.UUID,
    receiverId: DataTypes.UUID,
    // - valid statuses:
    // - resolved
    // - in-progress new-message
    // - in-progress stale
    // - new un-opened
    // - new opened
    status: {
      type: DataTypes.TEXT,
      defaultValue: messageStatus.NEW_UNOPENED,
    },
    parentId: DataTypes.INTEGER,
    threadId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {});
  messageModel.associate = function(models) {
    messageModel.belongsTo(models.user, { as: 'sender', foreignKey: 'senderId' });
    messageModel.belongsTo(models.user, { as: 'receiver', foreignKey: 'receiverId' });
    // -  basically, when a message is sent as a reply to another message,
    //    the reply holds the 'parentId' - which is the id of the original message
    //    this message is replying to
    messageModel.belongsTo(messageModel, { as: 'parent', foreignKey: 'parentId' });
  };

  messageModel.createWithPushNotification = ({ message }) => {
    let newMessage;
    return messageModel.create(message).then(newMessageRes => {
      newMessage = newMessageRes;
      return models.user.findOne({ where: { id: newMessage.receiverId }});
    }).then(user => {
      if (!user || !user.deviceId) return;
      const userIdentifier = models.user.getUserIdentifier({ user });
      const notifications = [{
        to: user.deviceId,
        body: 'New message from ' + userIdentifier,
        data: {
          message: 'New message from ' + userIdentifier,
        }
      }];
      return sendPushNotifications({ notifications });
    }).then(() => newMessage);
  }

  messageModel.getLatestForAllThreads = ({ userId }) => {
    const query = `\
      SELECT * FROM (\
        SELECT DISTINCT ON (messages."threadId") messages.*,\
        us."firstName" AS "senderFirstName",\
        us."lastName" AS "senderLastName",\
        us."photoUrl" AS "senderPhotoUrl",\
        us.id AS "senderId",\
        ur."firstName" AS "receiverFirstName",\
        ur."lastName" AS "receiverLastName",\
        ur."photoUrl" AS "receiverPhotoUrl",\
        ur.id AS "receiverId"\
        FROM messages\
        JOIN users us ON messages."senderId" = us.id\
        JOIN users ur ON messages."receiverId" = ur.id\
        WHERE "senderId"='${userId}'\
        OR "receiverId"='${userId}'\
        ORDER BY "threadId", "createdAt" DESC\
      ) p\
      ORDER BY "createdAt" DESC;\
    `;
    return sequelize.query(query).then(result => {
      return result[0];
    });
  };

  messageModel.getForThread = ({ threadId }) => {
    return messageModel.findAll({
      where: { threadId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: models.user, as: 'sender' },
        { model: models.user, as: 'receiver' },
      ],
    }).then(messagesRes => {
      return messagesRes.map(messageRaw => {
        const senderRaw = messageRaw.dataValues.sender.dataValues;
        const receiverRaw = messageRaw.dataValues.receiver.dataValues;
        const sender = Object.keys(senderRaw).reduce((all, k) => {
          const key = k.charAt(0).toUpperCase() + k.slice(1);
          all['sender' + key] = senderRaw[k];
          return all;
        }, {});
        const receiver = Object.keys(receiverRaw).reduce((all, k) => {
          const key = k.charAt(0).toUpperCase() + k.slice(1);
          all['receiver' + key] = receiverRaw[k];
          return all;
        }, {});

        return {
          ...messageRaw.dataValues,
          ...sender,
          ...receiver,
          sender: undefined,
          receiver: undefined,
        };
      });
    });
  };

  return messageModel;
};
