const express = require("express");
const router = express.Router();
const db = require("../db/mysqlDb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/authorization").authApi;
const { JWT_SECRET } = require("./../config");

router.post("/register", (req, res) => {
  console.log(req.body);
  let { login, password, role, forename, surname } = req.body;
  db.Users.create({
    login,
    password,
    role,
    forename,
    surname
  })
    .then(createdUser => {
      return res.status(201).json(createdUser);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

router.post("/login", async (req, res) => {
  let { login, password } = req.body;

  const user = await db.Users.findOne({
    where: {
      login
    }
  });
  if (!user) {
    return res.status(401).send();
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send();
  }
  const { id } = user;
  const token = jwt.sign(
    {
      id
    },
    JWT_SECRET,
    {
      expiresIn: "24h"
    }
  );
  return res
    .status(200)
    .header("x-auth", token)
    .send(user);
});

router.get("/", authorization, (req, res) => {
  const { user } = req;
  res.status(200).send(user);
});

module.exports = router;
