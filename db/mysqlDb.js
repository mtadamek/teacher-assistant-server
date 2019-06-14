const Sequelize = require("sequelize");
const {
  DB_NAME,
  DB_USERNAME,
  DB_PASS,
  DB_HOST,
  DB_MYSQL_PORT
} = require("./../config");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASS, {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_MYSQL_PORT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const initEntities = () => {
  db.Users = require("./models/Users")(sequelize, Sequelize);
  db.Groups = require("./models/Groups")(sequelize, Sequelize);
  db.UsersGroups = require("./models/UsersGroups")(sequelize, Sequelize);
  db.Quizzes = require("./models/Quizzes")(sequelize, Sequelize);
  db.Statistics = require("./models/Statistics")(sequelize, Sequelize);

  return Promise.all([
    //1:M -> Quizzes - Statistics
    db.Quizzes.hasMany(db.Statistics, { as: "Statistics" }),
    db.Statistics.belongsTo(db.Quizzes, { as: "Quiz" }),
    //1:M -> Users - Statistics
    db.Users.hasMany(db.Statistics, { as: "Statistics" }),
    db.Statistics.belongsTo(db.Users, { as: "User" }),
    //1:M -> Users - Quizzes
    db.Users.hasMany(db.Quizzes, { as: "Quizzes" }),
    db.Quizzes.belongsTo(db.Users, { as: "User" }),
    //N:M -> Users - Groups
    db.Users.belongsToMany(db.Groups, {
      through: "UsersGroups",
      foreignKey: "UserId"
    }),
    db.Groups.belongsToMany(db.Users, {
      through: "UsersGroups",
      foreignKey: "GroupId"
    })
  ]);
};

db.initDb = isForced => {
  initEntities().then(() => {
    db.sequelize
      .sync({
        force: isForced
      })
      .then(() => {
        console.error("database initialized");
      })
      .catch(err => {
        console.error(err);
      });
  });
};

module.exports = db;
