module.exports = function(sequelize, DataTypes) {
  const UsersGroups = sequelize.define(
    "UsersGroups",
    {},
    {
      timestamps: false
    }
  );

  return UsersGroups;
};
