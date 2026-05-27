import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import "../styles/dashboard.css";

const COLUMNS = [
  { key: "pendiente", label: "Lista de tareas" },
  { key: "en_proceso", label: "En proceso" },
  { key: "completada", label: "Hecho" },
];

const IconTask = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconFlag = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);

const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

function KanbanCard({ task, onDelete, onStatusChange }) {
  return (
    <div className={`kanban-card ${task.status === "completada" ? "card-done" : ""}`}>
      <div className="card-header">
        <input
          type="checkbox"
          className="card-checkbox"
          checked={task.status === "completada"}
          onChange={() =>
            onStatusChange(
              task,
              task.status === "completada" ? "pendiente" : "completada"
            )
          }
        />
        <span className="card-icon"><IconTask /></span>
        <h4 className={`card-title ${task.status === "completada" ? "title-done" : ""}`}>
          {task.titulo}
        </h4>
      </div>
      {task.descripcion && (
        <p className="card-description">{task.descripcion}</p>
      )}
      <div className="card-footer">
        <span className={`card-priority priority-${task.prioridad}`}>
          <IconFlag /> {task.prioridad}
        </span>
        <div className="card-actions">
          {COLUMNS.filter((c) => c.key !== task.status).map((col) => (
            <button
              key={col.key}
              className="btn-move"
              title={`Mover a ${col.label}`}
              onClick={() => onStatusChange(task, col.key)}
            >
              <IconArrow />
            </button>
          ))}
          <button
            className="btn-card-delete"
            onClick={() => onDelete(task.id)}
            title="Eliminar"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormCol, setShowFormCol] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tareas || response.data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (newTask, colKey) => {
    const taskWithStatus = { ...newTask, status: colKey };
    setTasks([taskWithStatus, ...tasks]);
    setShowFormCol(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/tasks/${task.id}`,
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (loading) {
    return <div className="loading-dashboard">Cargando...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="planify-header">
        <div className="planify-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <span className="logo-icon">⬡</span>
          <div>
            <span className="logo-name">Planify</span>
            <p className="logo-sub">Organiza y gestiona tus tareas diarias</p>
          </div>
        </div>
        <button className="btn-header-logout" onClick={handleLogout} title="Cerrar sesión">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      {/* Kanban Board */}
      <main className="kanban-board">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="kanban-column">
              <div className="column-header">
                <span className="column-title">{col.label}</span>
                <div className="column-header-actions">
                  <button
                    className="btn-col-icon"
                    onClick={() =>
                      setShowFormCol(showFormCol === col.key ? null : col.key)
                    }
                    title="Nueva tarea"
                  >
                    +
                  </button>
                  <button className="btn-col-icon" title="Opciones">⋯</button>
                </div>
              </div>

              {showFormCol === col.key && (
                <TaskForm
                  onTaskAdded={(t) => handleAddTask(t, col.key)}
                  onCancel={() => setShowFormCol(null)}
                  defaultStatus={col.key}
                />
              )}

              <div className="column-cards">
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
                {colTasks.length === 0 && showFormCol !== col.key && (
                  <div className="column-empty">Sin tareas</div>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default Dashboard;