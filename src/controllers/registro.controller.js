const { Registro, VehiculoModel } = require('../models');

// GET /api/registros/cliente/historial
const obtenerHistorialCliente = async (req, res) => {
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

// GET /api/registros/vehiculo/:idVehiculo
const obtenerRegistrosPorVehiculo = async (req, res) => {
    try {
        const { idVehiculo } = req.params;
        const registros = await Registro.find({ id_VehiculoFK: parseInt(idVehiculo) }).sort({ Fecha: -1 });
        res.json(registros);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener registros', error: error.message });
    }
};

module.exports = { obtenerHistorialCliente, obtenerRegistrosPorVehiculo };