require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = require("http").Server(app);

//socket.io
const io = require("socket.io")(server);
const sockets = require("./sockets");
sockets.connectionsHandler(io);

const db = require("./db/mysqlDb");
db.initDb(false);

//routes
const authRoutes = require("./routes/auth");
const groupsRoutes = require("./routes/groups");
const quizzesRoutes = require("./routes/quizzes");
const statisticsRoutes = require("./routes/statistics");

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/groups", groupsRoutes);
app.use("/quizzes", quizzesRoutes);
app.use("/statistics", statisticsRoutes);
+
app.get("/", (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 4400;

server.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
