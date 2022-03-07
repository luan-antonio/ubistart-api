const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/register", AuthController.registerNewUser);
router.post("/login", AuthController.login);

module.exports = router;
