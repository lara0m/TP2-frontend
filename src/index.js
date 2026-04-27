const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API Serverless (En desarrollo)' });
});

// Ejemplo de ruta de autenticación
app.post('/api/auth/login', (req, res) => {
  // Aquí irá la lógica de auth
  res.json({ message: 'Endpoint de Login simulado' });
});

// Variables para entorno serverless o entorno local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}

// Exportar como función Serverless para desplegar en AWS Lambda, Vercel, o Netlify
module.exports.handler = serverless(app);