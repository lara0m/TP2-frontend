const { sql } = require('../db/config');

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Viene del middleware de auth (token)

    if (!title) {
      return res.status(400).json({ message: 'El título de la tarea es obligatorio' });
    }

    const result = await sql`
      INSERT INTO tasks (user_id, title, description)
      VALUES (${userId}, ${title}, ${description || null})
      RETURNING *
    `;

    res.status(201).json({ message: 'Tarea creada exitosamente', task: result[0] });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todas las tareas del usuario logueado
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Sólo traemos las tareas del dueño del token

    const tasks = await sql`
      SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.json({ tasks });
  } catch (error) {
    console.error('Error en getTasks:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar una tarea (solo si es el dueño)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    // Verificar si la tarea existe y le pertenece al usuario
    const taskCheck = await sql`SELECT id FROM tasks WHERE id = ${id} AND user_id = ${userId}`;
    if (taskCheck.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
    }

    const result = await sql`
      UPDATE tasks 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status)
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    res.json({ message: 'Tarea actualizada', task: result[0] });
  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar una tarea (solo si es el dueño)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await sql`
      DELETE FROM tasks 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };