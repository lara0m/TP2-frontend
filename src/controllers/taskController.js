const tareaService = require('../services/taskService');

const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const usuarioId = req.user.id;

    if (!titulo) {
      return res.status(400).json({ message: 'El título de la tarea es obligatorio' });
    }

    const tarea = await tareaService.crearTarea(usuarioId, { titulo, descripcion });
    res.status(201).json({ message: 'Tarea creada exitosamente', tarea });
  } catch (error) {
    console.error('Error en crearTarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const tareas = await tareaService.obtenerTareasPorUsuario(usuarioId);
    res.json({ tareas });
  } catch (error) {
    console.error('Error en obtenerTareas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body;
    const usuarioId = req.user.id;

    const tarea = await tareaService.actualizarTarea(usuarioId, id, { titulo, descripcion, estado });
    res.json({ message: 'Tarea actualizada', tarea });
  } catch (error) {
    if (error.message === 'Tarea no encontrada o no tienes permisos') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error en actualizarTarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    await tareaService.eliminarTarea(usuarioId, id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Tarea no encontrada o no tienes permisos') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error en eliminarTarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea };