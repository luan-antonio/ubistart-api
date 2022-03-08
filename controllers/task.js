const Task = require("../models/Task");
const User = require("../models/User");

const add = async (
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
  });

  try {
    await task.save();
    res.status(201).json({ msg: "Tarefa adicionada com sucesso" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar adicionar a tarefa, tente novamente mais tarde",
    });
  }
};

const get = async ({ decodedToken: { id } }, res) => {
  try {
    const tasks = await Task.find({ author: id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar carregar as tarefas, tente novamente mais tarde",
    });
  }
};

const pagination = async (
  { decodedToken: { id }, query: { page = 1, limit = 10 } },
  res
) => {
  const user = await User.findById(id);

  if (page < 1) {
    return res.status(400).json({ msg: "A menor página possível é a 1" });
  }

  if (user.type !== "ADMIN") {
    return res
      .status(403)
      .json({ msg: "Esse recurso é apenas para administradores do sistema" });
  }

  try {
    const tasks = await Task.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments();

    res
      .status(200)
      .json({ tasks, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar carregar as tarefas, tente novamente mais tarde",
    });
  }
};

const close = async ({ body: { taskId, finished } }, res) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ msg: "A tarefa não foi encontrada" });
  }
  if (task.finished) {
    return res
      .status(403)
      .json({ msg: "Não é possível editar uma tarefa fechada" });
  }
  try {
    const updateResult = await Task.updateOne({ _id: taskId }, { finished });
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        msg: "Tarefa não encontrada",
      });
    }
    const closedTask = await Task.findById(taskId);
    res.status(200).json({ closedTask, msg: "Tarefa fechada" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar fechar a tarefa, tente novamente mais tarde ",
    });
  }
};

const edit = async ({ body: { taskId, lastEdited, dueDate, desc } }, res) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ msg: "A tarefa não foi encontrada" });
  }
  if (task.finished) {
    return res
      .status(403)
      .json({ msg: "Não é possível editar uma tarefa fechada" });
  }
  try {
    const fieldsToEdit = { dueDate, lastEdited, desc };
    const updateResult = await Task.updateOne({ _id: taskId }, fieldsToEdit);

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ msg: "A tarefa não foi encontrada" });
    }

    const newTask = await Task.findById(taskId);

    res.status(200).json({ newTask, msg: "Tarefa editada com sucesso" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro ao tentar editar a tarefa, tente novamente mais tarde",
    });
  }
};
module.exports = { add, get, close, edit, pagination };
