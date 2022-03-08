const express = require("express");
const checkToken = require("../middlewares/checkToken");
const TaskController = require("../controllers/task");

const router = express.Router();

router.post("/", checkToken, TaskController.newTask);

module.exports = router;
