const express = require('express');
const router = express.Router();
const { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea } = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/auth');

// Rutas Protegidas
router.get('/', verifyToken, obtenerTareas);
router.post('/', verifyToken, crearTarea);
router.put('/:id', verifyToken, actualizarTarea);
router.delete('/:id', verifyToken, eliminarTarea);

module.exports = router;