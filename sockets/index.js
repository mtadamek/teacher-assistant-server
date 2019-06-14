const authorization = require("../middleware/authorization").authSocket;
const db = require("../db/mysqlDb");

const connectedSockets = {};

const connectionsHandler = io => {
  io.use(authorization).on("connection", socket => {
    const clientId = `${socket.user.id}_${socket.id}`;
    console.log("A client just joined on", clientId);
    connectedSockets[clientId] = socket;

    const active = getActive();
    Object.keys(connectedSockets).forEach(keys => {
      connectedSockets[keys].emit("update-active", active);
    });

    socket.emit("welcome", "Witaj ziom!");

    socket.on("send-quiz-to-group", async ({ quizId, groupId }) => {
      const include = [
        { model: db.Users, as: "Users", where: { role: "student" } }
      ];

      try {
        const group = await db.Groups.findOne({
          where: { id: groupId },
          include: include
        });

        const studentsIds = group.Users ? group.Users.map(user => user.id) : [];
        const quiz = await db.Quizzes.findOne({ where: { id: quizId } });
        const { id, topic, exercises, UserId, time } = quiz;

        Object.keys(connectedSockets).forEach(keys => {
          if (studentsIds.includes(Number(keys.split("_")[0]))) {
            connectedSockets[keys].emit("get-new-quiz", {
              id,
              topic,
              exercises,
              UserId,
              time
            });
          }
        });
      } catch (error) {
        console.log("!=============send-quiz-to-group err", error);
      }
    });

    socket.on("send-quiz-to-student", async ({ quizId, studentId }) => {
      try {
        const quiz = await db.Quizzes.findOne({ where: { id: quizId } });
        const { id, topic, exercises, UserId, time } = quiz;
        Object.keys(connectedSockets).forEach(keys => {
          if (studentId === Number(keys.split("_")[0])) {
            connectedSockets[keys].emit("get-new-quiz", {
              id,
              topic,
              exercises,
              UserId,
              time
            });
          }
        });
      } catch (error) {
        console.log("!=============send-quiz-to-student err", error);
      }
    });

    socket.on("get-active", () => {
      socket.emit("update-active", getActive());
    });

    socket.on("send-student-quiz", async ({ quiz, values }) => {
      try {
        const newStatistic = {
          values,
          result: getQuizResult(quiz, values),
          QuizId: quiz.id,
          UserId: socket.user.id
        };
        await db.Statistics.create(newStatistic);
      } catch (error) {
        console.log("!=============send-student-quiz err", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected with", clientId);
      delete connectedSockets[clientId];
      const active = getActive();
      Object.keys(connectedSockets).forEach(keys => {
        connectedSockets[keys].emit("update-active", active);
      });
    });
  });
};

const getQuizResult = (quiz, studentQuiz) => {
  const { exercises } = quiz;
  const studentExercises = studentQuiz.exercises || [];
  let points = exercises.length;
  exercises.forEach((exercise, i) => {
    const { answers } = exercise;
    let check = true;
    answers.forEach((answer, j) => {
      let dataGood = false;
      let studentGood = false;
      if (
        exercises[i] &&
        exercises[i].answers[j] &&
        exercises[i].answers[j].good
      ) {
        dataGood = exercises[i].answers[j].good;
      }
      if (
        studentExercises[i] &&
        studentExercises[i].answers[j] &&
        studentExercises[i].answers[j].good
      ) {
        studentGood = studentExercises[i].answers[j].good;
      }
      if (!(dataGood === studentGood) && check) {
        check = !check;
        points--;
        return;
      }
    });
  });
  return { points, max: exercises.length };
};

const getActive = () =>
  Object.keys(connectedSockets).map(keys => Number(keys.split("_")[0]));

module.exports = {
  connectionsHandler
};
