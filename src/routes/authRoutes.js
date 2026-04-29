const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Rutas Públicas (No requieren Token JWT)
router.post('/register', register);
router.post('/login', login);

module.exports = router;