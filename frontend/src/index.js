import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Si tienes un archivo CSS para estilos globales
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);