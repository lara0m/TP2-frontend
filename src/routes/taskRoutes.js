const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/auth'); // El escudo de protección

// Rutas Protegidas (Deben llevar el encabezado 'Authorization': 'Bearer <token>')
router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;