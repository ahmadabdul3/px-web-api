'use strict';
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
    status: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    threadId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
  }, {});
  messageModel.associate = function(models) {
    messageModel.belongsTo(models.user, { as: 'sender', foreignKey: 'senderId' });
    messageModel.belongsTo(models.user, { as: 'receiver', foreignKey: 'receiverId' });
    // -  basically, when a message is sent as a reply to another message,
    //    the reply holds the 'parentId' - which is the id of the original message
    //    this message is replying to
    messageModel.belongsTo(messageModel, { as: 'parent', foreignKey: 'parentId' });
  };
  return messageModel;
};
