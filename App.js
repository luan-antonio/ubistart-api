require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const { DB_USER, DB_PASS, PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

mongoose
  .connect(
    process.env.MONGO_URI
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
