

export default function(sequelize, DataTypes) {
  const official = sequelize.define('official', {
    name: DataTypes.STRING,
  });

  official.associate = function(models) {
    // models.official.hasMany(models.Task);
  };

  return official;
};
