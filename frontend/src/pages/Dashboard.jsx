import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "../styles/dashboard.css";

function Dashboard({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Backend retorna { tareas: [...] } en base a los últimos cambios a español
      setTasks(response.data.tareas || response.data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === "completada";
    if (filter === "pending") return task.status !== "completada";
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completada").length,
    pending: tasks.filter(t => t.status !== "completada").length,
  };

  if (loading) {
    return <div className="loading-dashboard">Cargando tareas...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📋 Mis Tareas</h1>
            <p className="header-subtitle">Organiza y gestiona tus tareas diarias</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Stats Section */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon total">📊</div>
              <div className="stat-content">
                <h3>Total de Tareas</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">✅</div>
              <div className="stat-content">
                <h3>Completadas</h3>
                <p className="stat-number">{stats.completed}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-content">
                <h3>Pendientes</h3>
                <p className="stat-number">{stats.pending}</p>
              </div>
            </div>
          </section>

          {/* Controls Section */}
          <section className="controls-section">
            <div className="controls-left">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  Todas
                </button>
                <button
                  className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                  onClick={() => setFilter("pending")}
                >
                  Pendientes
                </button>
                <button
                  className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completadas
                </button>
              </div>
            </div>
            <button
              className="btn-new-task"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancelar" : "+ Nueva Tarea"}
            </button>
          </section>

          {/* Task Form */}
          {showForm && (
            <section className="form-section">
              <TaskForm onTaskAdded={handleAddTask} />
            </section>
          )}

          {/* Tasks List */}
          <section className="tasks-section">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">📭</p>
                <h3>No hay tareas</h3>
                <p>
                  {filter === "all" && "¡Crea una nueva tarea para comenzar!"}
                  {filter === "pending" && "¡No tienes tareas pendientes!"}
                  {filter === "completed" && "Aún no has completado ninguna tarea"}
                </p>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
