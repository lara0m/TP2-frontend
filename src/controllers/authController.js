const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await authService.registerUser({ name, email, password });
    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    if (error.message === 'El email ya está registrado') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const authData = await authService.loginUser({ email, password });
    res.json({ message: 'Login exitoso', ...authData });
  } catch (error) {
    if (error.message === 'Credenciales inválidas') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { register, login };