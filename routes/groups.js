const express = require("express");
const router = express.Router();
const db = require("../db/mysqlDb");
const authorization = require("../middleware/authorization").authApi;

router.get("/get-all-groups", authorization, async (req, res) => {
  const { user } = req;
  let include = [{ model: db.Groups, as: "Groups" }];
  try {
    let response = await db.Users.findOne({
      where: { id: user.id },
      include: include
    });
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/get-group-students", authorization, async (req, res) => {
  const { groupId } = req.query;
  let include = [{ model: db.Users, as: "Users", where : { role: 'student' } }];
  try {
    let response = await db.Groups.findOne({
      where: { id: groupId },
      include: include
    });
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
