import React, { useState } from "react";
import axios from "axios";
import "../styles/taskform.css";

function TaskForm({ onTaskAdded }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/tasks",
        {
          titulo,
          descripcion,
          prioridad,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Si el backend devuelve { tarea: {...} } gracias a los cambios en español
      onTaskAdded(response.data.tarea || response.data);
      setTitulo("");
      setDescripcion("");
      setPrioridad("media");
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Crear Nueva Tarea</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="titulo">Título de la Tarea *</label>
        <input
          type="text"
          id="titulo"
          placeholder="Ej: Completar proyecto..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          disabled={loading}
          maxLength="100"
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          placeholder="Añade detalles sobre la tarea..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={loading}
          rows="4"
          maxLength="500"
        />
      </div>

      <div className="form-group">
        <label htmlFor="prioridad">Prioridad</label>
        <select
          id="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          disabled={loading}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit-form">
          {loading ? "Creando..." : "Crear Tarea"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
