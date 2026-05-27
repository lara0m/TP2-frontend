import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-icon">⬡</span>
          <span className="home-logo-name">Planify</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/login" className="btn-home-secondary" style={{ padding: "8px 20px", fontSize: "14px" }}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn-home-primary" style={{ padding: "8px 20px", fontSize: "14px" }}>
            Registrarse
          </Link>
        </div>
      </header>

      <main className="home-content">
        <div className="home-hero">
          <h1>Organizá tus tareas,<br />sin complicaciones</h1>
          <p>Un kanban simple y elegante para gestionar tus proyectos del día a día.</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="btn-home-primary">Empezar gratis</Link>
            <Link to="/login" className="btn-home-secondary">Ya tengo cuenta</Link>
          </div>
        </div>

        <div className="home-features">
          <div className="home-feature">
            <h3>📋 Tablero visual</h3>
            <p>Organizá tus tareas en columnas: pendiente, en proceso y hecho</p>
          </div>
          <div className="home-feature">
            <h3>⚡ Rápido y simple</h3>
            <p>Sin distracciones. Creá tareas en segundos desde cualquier columna</p>
          </div>
          <div className="home-feature">
            <h3>🔐 Tus datos, seguros</h3>
            <p>Autenticación segura. Solo vos accedés a tus tareas</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;