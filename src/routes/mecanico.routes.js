const express = require('express');
const router = express.Router();
const MecanicoController = require('../controllers/mecanico.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Perfil
router.get('/perfil', verificarToken, MecanicoController.obtenerPerfil);
router.post('/registrar', verificarToken, MecanicoController.registrarMecanico);

// Órdenes
router.get('/ordenes/pendientes', verificarToken, MecanicoController.obtenerOrdenesPendientes);
router.get('/ordenes/activas', verificarToken, MecanicoController.obtenerMisOrdenesActivas);
router.get('/orden/:id', verificarToken, MecanicoController.obtenerOrdenPorId);

// Acciones sobre órdenes
router.put('/orden/:id/tomar', verificarToken, MecanicoController.tomarOrden);
router.put('/orden/:id/completa', verificarToken, MecanicoController.actualizarOrdenCompleta);

// Historial
router.get('/historial', verificarToken, MecanicoController.obtenerHistorialMecanico);

// Trabajos
router.post('/trabajo', verificarToken, MecanicoController.registrarTrabajo);

module.exports = router;