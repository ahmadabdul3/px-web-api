'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
    senderId: DataTypes.UUID,
    receiverId: DataTypes.UUID,
    status: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    threadId: DataTypes.UUID,
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};
