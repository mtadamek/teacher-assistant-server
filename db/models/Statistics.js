module.exports = (sequelize, DataTypes) => {
  const Statistics = sequelize.define(
    "Statistics",
    {
      values: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      result: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      timestamps: true
    }
  );

  return Statistics;
};
