const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/orden.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Listar órdenes
router.get('/', verificarToken, OrdenController.obtenerOrdenes);
router.get('/estado/:estado', verificarToken, OrdenController.obtenerOrdenesPorEstado);
router.get('/vehiculo/:idVehiculo', verificarToken, OrdenController.obtenerOrdenesPorVehiculo);
router.get('/mis-ordenes', verificarToken, OrdenController.obtenerMisOrdenesActivas);

// Crear orden
router.post('/', verificarToken, OrdenController.crearOrden);

// Actualizar orden
router.put('/:id/estado', verificarToken, OrdenController.actualizarEstado);
router.put('/:id/costo', verificarToken, OrdenController.actualizarCosto);
router.put('/:id/observaciones', verificarToken, OrdenController.actualizarObservaciones);

module.exports = router;