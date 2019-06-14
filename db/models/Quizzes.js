module.exports = (sequelize, DataTypes) => {
  const Quizzes = sequelize.define(
    "Quizzes",
    {
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255]
        }
      },
      exercises: {
        type: DataTypes.JSON
      },
      time: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: true
    }
  );

  return Quizzes;
};
