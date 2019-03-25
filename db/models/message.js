'use strict';
import { messageStatus } from 'src/constants/messaging';

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

  messageModel.getLatestForAllThreads = ({ userId }) => {
    const query = `\
      SELECT DISTINCT ON (messages."threadId") messages.*,\
      us."firstName" AS "senderFirstName",\
      us."lastName" AS "senderLastName",\
      us.id AS "senderId",\
      ur."firstName" AS "receiverFirstName",\
      ur."lastName" AS "receiverLastName",\
      ur.id AS "receiverId"\
      FROM messages\
      JOIN users us ON messages."senderId" = us.id\
      JOIN users ur ON messages."receiverId" = ur.id\
      WHERE "senderId"='${userId}'\
      OR "receiverId"='${userId}'\
      ORDER BY "threadId", "createdAt" DESC;\
    `;
    return sequelize.query(query).then(result => {
      return result[0];
    });
  };

  return messageModel;
};
