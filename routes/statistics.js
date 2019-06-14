const express = require("express");
const router = express.Router();
const db = require("../db/mysqlDb");
const authorization = require("../middleware/authorization").authApi;

router.get("/", authorization, async (req, res) => {
  const { user } = req;
  const { quizId, groupId } = req.query;
  let include = [{ model: db.Users, as: "Users", where: { role: "student" } }];
  try {
    const group = await db.Groups.findOne({
      where: { id: groupId },
      include: include
    });
    const studentsIds = group.Users.map(student => student.id);
    const statistics = await db.Statistics.findAll({
      where: { QuizId: quizId, UserId: studentsIds }
    });
    const response = {};
    statistics.forEach(statistic => {
      response[statistic.UserId] = statistic;
    });
    res.status(200).send(response);
  } catch (error) {
    console.log("========statistics error==========", error);
    res.status(404).send(error);
  }
});

module.exports = router;
