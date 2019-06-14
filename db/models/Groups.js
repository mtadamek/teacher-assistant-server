module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    "Groups",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255]
        }
      }
    },
    {
      timestamps: false
    }
  );

  return Groups;
};
