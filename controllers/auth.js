const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailIsValid = require("../helpers/emailValidator");

const registerNewUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "O nome é obrigatório" });
  }
  if (!password) {
    return res.status(400).json({ msg: "A senha é obrigatória" });
  }
  if (!confirmPassword) {
    return res
      .status(400)
      .json({ msg: "A confirmação da senha é obrigatória" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "As senhas não conferem" });
  }
  if (!emailIsValid(email)) {
    return res.status(400).json({ msg: "O email não é válido" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ msg: "O email informado já está cadastrado" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar registrar o usuário, tente novamente mais tarde",
    });
  }
};

module.exports = { registerNewUser };
