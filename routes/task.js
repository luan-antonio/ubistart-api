const express = require("express");
const checkToken = require("../middlewares/checkToken");
const TaskController = require("../controllers/task");

const router = express.Router();

router.post("/", checkToken, TaskController.add);
router.get("/", checkToken, TaskController.get);
router.post("/close", checkToken, TaskController.close);
router.post("/edit", checkToken, TaskController.edit);

module.exports = router;
