const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: String,
  password: String,
  type: String,
});

module.exports = schema;