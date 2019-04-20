'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserModel = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    email: DataTypes.TEXT,
    auth0Id: DataTypes.TEXT,
    role: DataTypes.TEXT,
    photoUrl: DataTypes.TEXT,
    deviceId: DataTypes.TEXT,
  }, {});

  UserModel.associate = function(models) {
    // associations can be defined here
  };

  UserModel.createOrGetExisting = ({ user }) => {
    const email = user.email.trim().toLowerCase();
    user.email = email;

    return UserModel.findOne({ where: { email } }).then(existingUser => {
      if (existingUser) {
        return UserModel.update({ deviceId: user.deviceId }, {
          where: { email },
          returning: true,
        }).then(updateUserRes => {
          const secondIndex = updateUserRes && updateUserRes[1] || [];
          return secondIndex[0] || {};
        });
      }
      return UserModel.create(user);
    });
  };

  UserModel.getUserIdentifier = ({ user }) => {
    if (!user.firstName) return user.email || 'a PX user';
    return user.firstName + ' ' + (user.lastName || '');
  }

  return UserModel;
};
