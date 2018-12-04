

export default function(sequelize,DataTypes) {
  const sample = sequelize.define('sample',{
    name: DataTypes.STRING,
  });

  sample.associate = function(models) {
    // models.sample.hasMany(models.Task);
  };

  return sample;
};
