const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/cliente.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Perfil
router.get('/perfil', verificarToken, ClienteController.obtenerPerfil);
router.get('/mis-vehiculos', verificarToken, ClienteController.obtenerMisVehiculos);

// Registro
router.post('/registrar', ClienteController.registrarCliente);

// Historial
router.get('/historial', verificarToken, ClienteController.obtenerHistorial);

module.exports = router;