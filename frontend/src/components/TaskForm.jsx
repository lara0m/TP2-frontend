import React, { useState } from "react";
import axios from "axios";
import "../styles/taskform.css";

function TaskForm({ onTaskAdded, onCancel, defaultStatus = "pendiente" }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/tasks",
        { titulo, descripcion, prioridad, estado: defaultStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    <form className="task-form-inline" onSubmit={handleSubmit}>
      {error && <div className="form-error-inline">{error}</div>}

      <input
        type="text"
        className="input-titulo"
        placeholder="Título de la tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        disabled={loading}
        autoFocus
        maxLength="100"
      />

      <textarea
        className="input-descripcion"
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={loading}
        rows="2"
        maxLength="500"
      />

      <div className="form-inline-row">
        <select
          className="select-prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          disabled={loading}
        >
          <option value="baja">🟢 Baja</option>
          <option value="media">🟡 Media</option>
          <option value="alta">🔴 Alta</option>
        </select>

        <div className="form-inline-actions">
          <button type="button" className="btn-cancel-inline" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-add-inline" disabled={loading || !titulo.trim()}>
            {loading ? "..." : "Agregar"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;