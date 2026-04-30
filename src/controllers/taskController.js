const taskService = require('../services/taskService');

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'El título de la tarea es obligatorio' });
    }

    const task = await taskService.createTask(userId, { title, description });
    res.status(201).json({ message: 'Tarea creada exitosamente', task });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasksByUser(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error en getTasks:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const task = await taskService.updateTask(userId, id, { title, description, status });
    res.json({ message: 'Tarea actualizada', task });
  } catch (error) {
    if (error.message === 'Tarea no encontrada o no tienes permisos') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error en updateTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await taskService.deleteTask(userId, id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Tarea no encontrada o no tienes permisos') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error en deleteTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };