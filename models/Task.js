const mongoose = require("mongoose");
const taskSchema = require('../schemas/Task');

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;