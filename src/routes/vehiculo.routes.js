const express = require('express');
const router = express.Router();
const VehiculoController = require('../controllers/vehiculo.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Listar vehículos
router.get('/', verificarToken, VehiculoController.obtenerVehiculos);
router.get('/:id', verificarToken, VehiculoController.obtenerVehiculoPorId);

// Crear vehículo
router.post('/', verificarToken, VehiculoController.crearVehiculo);

// Actualizar vehículo
router.put('/:id', verificarToken, VehiculoController.actualizarVehiculo);

// Eliminar vehículo
router.delete('/:id', verificarToken, VehiculoController.eliminarVehiculo);

module.exports = router;