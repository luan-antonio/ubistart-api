const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const { DB_USER, DB_PASS, PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@ubistart.rlpug.mongodb.net/ubistartTODO?retryWrites=true&w=majority`
  )
  .then(
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
      console.log("Connected to the Database");
    })
  )
  .catch((err) => {
    console.log(err);
  });
