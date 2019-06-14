const jwt = require("jsonwebtoken");
const db = require("../db/mysqlDb");
const { JWT_SECRET } = require("./../config");

const authApi = (req, res, next) => {
  let token = req.header("x-auth");
  console.log("token", token);
  jwt
    .verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw err;
      }
      return db.Users.findOne({
        where: {
          id: decoded.id
        }
      });
    })
    .then(user => {
      if (!user) {
        throw "Unauthorized";
      }
      req.user = user;
      next();
    })
    .catch(error => {
      console.log("error: ", error);
      return res.status(401).send({
        error
      });
    });
};

const authSocket = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
};

module.exports = { authApi, authSocket };
