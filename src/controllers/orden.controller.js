const { OrdenServicio, VehiculoModel } = require('../models');

// GET /api/ordenes
const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await OrdenServicio.find();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes', error: error.message });
    }
};

// GET /api/ordenes/estado/:estado
const obtenerOrdenesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const ordenes = await OrdenServicio.find({ Estado: estado });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes', error: error.message });
    }
};

// GET /api/ordenes/vehiculo/:idVehiculo
const obtenerOrdenesPorVehiculo = async (req, res) => {
    try {
        const { idVehiculo } = req.params;
        const ordenes = await OrdenServicio.find({ id_VehiculoFK: parseInt(idVehiculo) });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes', error: error.message });
    }
};

// GET /api/ordenes/mis-ordenes
const obtenerMisOrdenesActivas = async (req, res) => {
    try {
        const clienteId = req.usuario.id;
        const vehiculos = await VehiculoModel.findByCliente(clienteId);
        const idsVehiculos = vehiculos.map(v => v.id_vehiculo);
        
        const ordenes = await OrdenServicio.find({ 
            id_VehiculoFK: { $in: idsVehiculos },
            Estado: { $in: ['Pendiente', 'En Proceso'] }
        });
        
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes', error: error.message });
    }
};

// POST /api/ordenes
const crearOrden = async (req, res) => {
    try {
        const nuevaOrden = new OrdenServicio({
            id_OrdenServicio: Math.floor(Math.random() * 900000) + 100000,
            F_entrada: new Date(),
            Estado: 'Pendiente',
            Costo: req.body.Costo || 0,
            Observaciones: req.body.Observaciones,
            id_MecanicoFK: req.body.id_MecanicoFK || null,
            id_VehiculoFK: req.body.id_VehiculoFK,
            Cita: req.body.Cita || null
        });
        const resultado = await nuevaOrden.save();
        res.status(201).json({ mensaje: 'Orden creada', id_mongo: resultado._id });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear orden', error: error.message });
    }
};

// PUT /api/ordenes/:id/estado
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const updateData = { Estado: estado };
        if (estado === 'Terminado') {
            updateData.F_Salida = new Date();
        }
        const resultado = await OrdenServicio.findByIdAndUpdate(id, updateData, { new: true });
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
    }
};

// PUT /api/ordenes/:id/costo
const actualizarCosto = async (req, res) => {
    try {
        const { id } = req.params;
        const { costo } = req.body;
        const resultado = await OrdenServicio.findByIdAndUpdate(id, { Costo: costo }, { new: true });
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        res.json({ mensaje: 'Costo actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar costo', error: error.message });
    }
};

// PUT /api/ordenes/:id/observaciones
const actualizarObservaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;
        const resultado = await OrdenServicio.findByIdAndUpdate(id, { Observaciones: observaciones }, { new: true });
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        res.json({ mensaje: 'Observaciones actualizadas' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar observaciones', error: error.message });
    }
};

module.exports = { 
    obtenerOrdenes, 
    obtenerOrdenesPorEstado, 
    obtenerOrdenesPorVehiculo,
    obtenerMisOrdenesActivas,
    crearOrden, 
    actualizarEstado, 
    actualizarCosto, 
    actualizarObservaciones 
};