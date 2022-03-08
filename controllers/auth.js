const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailIsValid = require("../helpers/emailValidator");

const registerNewUser = async (
  { body: { email, password, confirmPassword, type } },
  res
) => {
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

  const userType = {
    ADMIN: "ADMIN",
  };

  const user = new User({
    email,
    password: passwordHash,
    type: userType[type] || "DEFAULT",
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

const login = async ({ body: { email, password } }, res) => {
  if (!email) {
    return res.status(400).json({ msg: "O email é obrigatório" });
  }

  if (!emailIsValid(email)) {
    return res.status(400).json({ msg: "O email não é válido" });
  }

  if (!password) {
    return res.status(400).json({ msg: "A senha é obrigatória" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user.id,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar logar o usuário, tente novamente mais tarde",
    });
  }
};

module.exports = { registerNewUser, login };
