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
    role: DataTypes.TEXT
  }, {});
  UserModel.associate = function(models) {
    // associations can be defined here
  };

  UserModel.createOrGetExisting = ({ user }) => {
    const email = user.email.trim().toLowerCase();
    user.email = email;

    return UserModel.findOne({ where: { email } }).then(existingUser => {
      if (existingUser) return { user: existingUser, status: 'px_existing' };
      return UserModel.create(user);
    }).then(userRes => {
      if (userRes.status === 'px_existing') return userRes;
      return { user: userRes, status: 'px_new' };
    });
  };

  return UserModel;
};
