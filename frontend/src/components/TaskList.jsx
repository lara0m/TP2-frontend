import React, { useState } from "react";
import axios from "axios";
import "../styles/tasklist.css";

function TaskList({ tasks, onDeleteTask }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleCompleteTask = async (task) => {
    setUpdatingId(task.id);
    try {
      const token = localStorage.getItem("token");
      const newStatus = task.status === "completada" ? "pendiente" : "completada";

      await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/api/tasks/${task.id}`,
        { estado: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Recargar la página para actualizar
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "priority-high";
      case "media":
        return "priority-medium";
      case "baja":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "🔴";
      case "media":
        return "🟡";
      case "baja":
        return "🟢";
      default:
        return "🟡";
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-card ${task.status === "completada" ? "completed" : ""}`}
        >
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.status === "completada"}
              onChange={() => handleCompleteTask(task)}
              disabled={updatingId === task.id}
            />
          </div>

          <div className="task-content">
            <div className="task-header">
              <h4 className="task-title">{task.titulo}</h4>
              <span className={`priority-badge ${getPriorityColor(task.prioridad)}`}>
                {getPriorityIcon(task.prioridad)} {task.prioridad}
              </span>
            </div>
            {task.descripcion && (
              <p className="task-description">{task.descripcion}</p>
            )}
            <div className="task-footer">
              <span className="task-date">
                📅 {new Date(task.created_at).toLocaleDateString("es-ES")}
              </span>
              <span className={`task-status ${task.status}`}>
                {task.status === "completada" ? "✅ Completada" : "⏳ Pendiente"}
              </span>
            </div>
          </div>

          <div className="task-actions">
            <button
              className="btn-delete"
              onClick={() => onDeleteTask(task.id)}
              title="Eliminar tarea"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
