const mongoose = require("mongoose");

const schema = mongoose.Schema({
  timestamp: Number,
  desc: String,
  title: String,
  dueDate: Number,
  lastEdited: Number,
  finished: Number,
  author: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = schema;
