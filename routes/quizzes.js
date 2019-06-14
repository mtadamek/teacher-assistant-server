const express = require("express");
const router = express.Router();
const db = require("../db/mysqlDb");
const authorization = require("../middleware/authorization").authApi;

router.get("/", authorization, async (req, res) => {
  const { user } = req;
  try {
    const response = await db.Quizzes.findAll({
      where: { UserId: user.id }
    });
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/", authorization, async (req, res) => {
  const { user } = req;
  const { topic, exercises, time } = req.body;
  try {
    const response = await db.Quizzes.create({
      topic,
      exercises,
      time,
      UserId: user.id
    });
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/", authorization, async (req, res) => {
  const quiz = req.body;
  try {
    const selectedQuiz = await db.Quizzes.findOne({ where: { id: quiz.id } });
    const response = await selectedQuiz.update(quiz);
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/", authorization, async (req, res) => {
  const { id } = req.body;
  try {
    await db.Quizzes.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
