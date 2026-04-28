const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Verificamos el token apuntando a nuestra firma secreta
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified; // Guardamos los datos del usuario en la request
    next(); // Permite que la petición continúe al controlador
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = { verifyToken };