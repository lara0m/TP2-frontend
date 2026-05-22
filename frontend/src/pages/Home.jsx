import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Gestor de Tareas</h1>
        <p className="subtitle">Organiza tu vida, una tarea a la vez</p>
      </header>

      <main className="home-content">
        <section className="hero">
          <h2>Bienvenido al Gestor de Tareas</h2>
          <p>
            Una aplicación simple pero poderosa para gestionar tus tareas diarias
            de manera eficiente.
          </p>

          <div className="features">
            <div className="feature">
              <h3>📋 Crear Tareas</h3>
              <p>Crea y organiza tus tareas de manera sencilla</p>
            </div>
            <div className="feature">
              <h3>✏️ Editar</h3>
              <p>Modifica tus tareas en cualquier momento</p>
            </div>
            <div className="feature">
              <h3>✅ Completar</h3>
              <p>Marca tus tareas como completadas</p>
            </div>
            <div className="feature">
              <h3>🔐 Seguridad</h3>
              <p>Tus datos están seguros y protegidos</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h3>¿Listo para comenzar?</h3>
          <p>Regístrate o inicia sesión para empezar a gestionar tus tareas</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Registrarse
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 Gestor de Tareas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;