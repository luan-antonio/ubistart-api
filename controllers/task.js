const Task = require("../models/Task");

const newTask = async (
  { decodedToken: { id }, body: { timestamp, desc, title, dueDate } },
  res
) => {
  if (!timestamp) {
    return res
      .status(400)
      .json({ msg: "O data e a hora de criação da tarefa são obrigatórios" });
  }
  if (!title) {
    return res.status(400).json({ msg: "O título da tarefa é obrigatório" });
  }

  const task = new Task({
    author: id,
    timestamp,
    desc,
    title,
    dueDate,
    status: "OPEN"
  });

  try {
    await task.save();
    res.status(201).json({ msg: "Tarefa adicionada com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Ocorreu um erro ao tentar adicionar a tarefa, tente novamente mais tarde",
      });
  }
};

module.exports = { newTask };
