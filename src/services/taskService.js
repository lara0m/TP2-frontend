const { sql } = require('../db/config');

const crearTarea = async (usuarioId, { titulo, descripcion }) => {
  // Mantenemos los nombres de las columnas en inglés para no romper tu base de datos actual,
  // pero usamos variables en español en todo el código.
  const result = await sql`
    INSERT INTO tasks (user_id, title, description)
    VALUES (${usuarioId}, ${titulo}, ${descripcion || null})
    RETURNING *
  `;
  return result[0];
};

const obtenerTareasPorUsuario = async (usuarioId) => {
  const tareas = await sql`
    SELECT * FROM tasks WHERE user_id = ${usuarioId} ORDER BY created_at DESC
  `;
  return tareas;
};

const actualizarTarea = async (usuarioId, tareaId, { titulo, descripcion, estado }) => {
  const check = await sql`SELECT id FROM tasks WHERE id = ${tareaId} AND user_id = ${usuarioId}`;
  if (check.length === 0) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }

  const result = await sql`
    UPDATE tasks 
    SET 
      title = COALESCE(${titulo}, title),
      description = COALESCE(${descripcion}, description),
      status = COALESCE(${estado}, status)
    WHERE id = ${tareaId} AND user_id = ${usuarioId}
    RETURNING *
  `;
  return result[0];
};

const eliminarTarea = async (usuarioId, tareaId) => {
  const result = await sql`
    DELETE FROM tasks 
    WHERE id = ${tareaId} AND user_id = ${usuarioId}
    RETURNING id
  `;
  
  if (result.length === 0) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }
  return true;
};

module.exports = { crearTarea, obtenerTareasPorUsuario, actualizarTarea, eliminarTarea };