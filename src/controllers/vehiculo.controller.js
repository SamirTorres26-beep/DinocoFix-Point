const { VehiculoModel } = require('../models');

// GET /api/vehiculos
const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await VehiculoModel.findAll();
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener vehículos', error: error.message });
    }
};

// GET /api/vehiculos/:id
const obtenerVehiculoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await VehiculoModel.findById(id);
        if (!vehiculo) {
            return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener vehículo', error: error.message });
    }
};

// POST /api/vehiculos
const crearVehiculo = async (req, res) => {
    try {
        const { cliente_id, marca, modelo, anio, placa, color } = req.body;
        const nuevoVehiculo = await VehiculoModel.create({ cliente_id, marca, modelo, anio, placa, color });
        res.status(201).json({ mensaje: 'Vehículo creado', vehiculo: nuevoVehiculo });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ mensaje: 'La placa ya existe' });
        }
        res.status(500).json({ mensaje: 'Error al crear vehículo', error: error.message });
    }
};

// PUT /api/vehiculos/:id
const actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, anio, placa, color } = req.body;
        const actualizado = await VehiculoModel.update(id, { marca, modelo, anio, placa, color });
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
        res.json({ mensaje: 'Vehículo actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar vehículo', error: error.message });
    }
};

// DELETE /api/vehiculos/:id
const eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await VehiculoModel.delete(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
        res.json({ mensaje: 'Vehículo eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar vehículo', error: error.message });
    }
};

module.exports = { obtenerVehiculos, obtenerVehiculoPorId, crearVehiculo, actualizarVehiculo, eliminarVehiculo };