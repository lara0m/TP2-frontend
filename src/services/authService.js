const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../db/config');

const registerUser = async ({ name, email, password }) => {
  // Verificar si el usuario ya existe
  const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    throw new Error('El email ya está registrado');
  }

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insertar en la BD
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email
  `;

  return result[0];
};

const loginUser = async ({ email, password }) => {
  // Buscar al usuario por email
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (users.length === 0) {
    throw new Error('Credenciales inválidas');
  }
  const user = users[0];

  // Comparar contraseñas
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  // Generar Token
  const token = jwt.sign(
    { id: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );

  return { 
    token, 
    user: { id: user.id, name: user.name, email: user.email } 
  };
};

module.exports = { registerUser, loginUser };