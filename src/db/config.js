const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

// Construimos la URL de conexión a partir de las variables de entorno individuales
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const DB_PORT = process.env.DB_PORT || 5432;

// Neon requiere conexión con SSL, por lo que agregamos ?sslmode=require
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;

const sql = neon(connectionString);

module.exports = { sql };