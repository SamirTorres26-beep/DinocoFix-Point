const { ClienteModel, VehiculoModel, Registro } = require('../models');

// GET /api/clientes/perfil
const obtenerPerfil = async (req, res) => {
    try {
        const clienteId = req.usuario.id;
        const cliente = await ClienteModel.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
    }
};

// GET /api/clientes/mis-vehiculos
const obtenerMisVehiculos = async (req, res) => {
    try {
        const clienteId = req.usuario.id;
        const vehiculos = await VehiculoModel.findByCliente(clienteId);
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener vehículos', error: error.message });
    }
};

// POST /api/clientes/registrar
const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, usuario, contrasena } = req.body;
        
        const existe = await ClienteModel.exists(usuario);
        if (existe) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }
        
        const nuevoCliente = await ClienteModel.create({ nombre, apellido, telefono, email, usuario, contrasena });
        res.status(201).json({ mensaje: 'Cliente registrado', cliente: nuevoCliente });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar cliente', error: error.message });
    }
};

// GET /api/clientes/historial
const obtenerHistorial = async (req, res) => {
    try {
        const clienteId = req.usuario.id;
        const vehiculos = await VehiculoModel.findByCliente(clienteId);
        const idsVehiculos = vehiculos.map(v => v.id_vehiculo);
        
        const registros = await Registro.find({ id_VehiculoFK: { $in: idsVehiculos } }).sort({ Fecha: -1 });
        
        const resultado = vehiculos.map(vehiculo => ({
            ...vehiculo,
            registros: registros.filter(r => r.id_VehiculoFK === vehiculo.id_vehiculo)
        }));
        
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

module.exports = { obtenerPerfil, obtenerMisVehiculos, registrarCliente, obtenerHistorial };