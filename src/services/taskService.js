const { sql } = require('../db/config');

const createTask = async (userId, { title, description }) => {
  const result = await sql`
    INSERT INTO tasks (user_id, title, description)
    VALUES (${userId}, ${title}, ${description || null})
    RETURNING *
  `;
  return result[0];
};

const getTasksByUser = async (userId) => {
  const tasks = await sql`
    SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return tasks;
};

const updateTask = async (userId, taskId, { title, description, status }) => {
  // Verificar si existe y pertenece al usuario
  const taskCheck = await sql`SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${userId}`;
  if (taskCheck.length === 0) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }

  const result = await sql`
    UPDATE tasks 
    SET 
      title = COALESCE(${title}, title),
      description = COALESCE(${description}, description),
      status = COALESCE(${status}, status)
    WHERE id = ${taskId} AND user_id = ${userId}
    RETURNING *
  `;
  return result[0];
};

const deleteTask = async (userId, taskId) => {
  const result = await sql`
    DELETE FROM tasks 
    WHERE id = ${taskId} AND user_id = ${userId}
    RETURNING id
  `;
  
  if (result.length === 0) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }
  return true;
};

module.exports = { createTask, getTasksByUser, updateTask, deleteTask };