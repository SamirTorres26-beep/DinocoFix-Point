const express = require('express');
const router = express.Router();
const RegistroController = require('../controllers/registro.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Historial del cliente
router.get('/cliente/historial', verificarToken, RegistroController.obtenerHistorialCliente);

// Registros por vehículo
router.get('/vehiculo/:idVehiculo', verificarToken, RegistroController.obtenerRegistrosPorVehiculo);

module.exports = router;