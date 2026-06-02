const { MecanicoModel, OrdenServicio, Registro } = require('../models');

// GET /api/mecanicos/perfil
const obtenerPerfil = async (req, res) => {
    try {
        const mecanicoId = req.usuario.id;
        const mecanico = await MecanicoModel.findById(mecanicoId);
        if (!mecanico) {
            return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
        }
        res.json(mecanico);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
    }
};

// POST /api/mecanicos/registrar
const registrarMecanico = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, usuario, contrasena } = req.body;
        
        const existe = await MecanicoModel.findByUsuario(usuario);
        if (existe) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }
        
        const nuevoMecanico = await MecanicoModel.create({
            nombre, apellido, telefono, email, usuario, contrasena
        });
        
        res.status(201).json({ mensaje: 'Mecánico registrado', mecanico: nuevoMecanico });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar mecánico', error: error.message });
    }
};

// GET /api/mecanicos/ordenes/pendientes
const obtenerOrdenesPendientes = async (req, res) => {
    try {
        const ordenes = await OrdenServicio.find({ Estado: 'Pendiente' });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes pendientes', error: error.message });
    }
};

// GET /api/mecanicos/ordenes/activas
const obtenerMisOrdenesActivas = async (req, res) => {
    try {
        const mecanicoId = req.usuario.id;
        const ordenes = await OrdenServicio.find({ 
            id_MecanicoFK: mecanicoId,
            Estado: { $in: ['Pendiente', 'En Proceso'] }
        });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes activas', error: error.message });
    }
};

// GET /api/mecanicos/orden/:id
const obtenerOrdenPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await OrdenServicio.findById(id);
        if (!orden) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener orden', error: error.message });
    }
};

// PUT /api/mecanicos/orden/:id/tomar
const tomarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const mecanicoId = req.usuario.id;
        
        const orden = await OrdenServicio.findById(id);
        if (!orden) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        
        orden.id_MecanicoFK = mecanicoId;
        orden.Estado = 'En Proceso';
        await orden.save();
        
        res.json({ mensaje: 'Orden tomada exitosamente', orden });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: 'Error al tomar la orden', error: error.message });
    }
};

// PUT /api/mecanicos/orden/:id/completa
const actualizarOrdenCompleta = async (req, res) => {
    try {
        const { id } = req.params;
        const { Estado, Costo, Observaciones } = req.body;
        
        const updateData = {};
        if (Estado !== undefined) updateData.Estado = Estado;
        if (Costo !== undefined) updateData.Costo = Costo;
        if (Observaciones !== undefined) updateData.Observaciones = Observaciones;
        if (Estado === 'Terminado') updateData.F_Salida = new Date();
        
        const resultado = await OrdenServicio.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }
        
        res.json({ mensaje: 'Orden actualizada', orden: resultado });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: 'Error al actualizar orden', error: error.message });
    }
};

// GET /api/mecanicos/historial
const obtenerHistorialMecanico = async (req, res) => {
    try {
        const mecanicoId = req.usuario.id;
        const historial = await Registro.find({ id_MecanicoFK: mecanicoId }).sort({ Fecha: -1 });
        res.json(historial);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

// POST /api/mecanicos/trabajo
const registrarTrabajo = async (req, res) => {
    try {
        const { idVehiculo, descripcion, costo, idOrden } = req.body;
        const mecanicoId = req.usuario.id;
        
        const mecanico = await MecanicoModel.findById(mecanicoId);
        const mecanicoNombre = mecanico ? `${mecanico.nombre} ${mecanico.apellido}` : 'Mecánico';
        
        const nuevoRegistro = new Registro({
            id_Registro: Math.floor(Math.random() * 900000) + 100000,
            Fecha: new Date(),
            CostoFinal: costo,
            Descripcion: descripcion,
            MecanicoEncargado: mecanicoNombre,
            id_MecanicoFK: mecanicoId,
            id_VehiculoFK: idVehiculo,
            progreso: 100,
            tareas_realizadas: [descripcion]
        });
        
        const resultado = await nuevoRegistro.save();
        
        if (idOrden) {
            await OrdenServicio.findByIdAndUpdate(idOrden, { 
                Estado: 'Terminado',
                F_Salida: new Date(),
                Costo: costo
            });
        }
        
        res.status(201).json({ mensaje: 'Trabajo registrado', id_mongo: resultado._id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: 'Error al registrar trabajo', error: error.message });
    }
};

module.exports = { 
    obtenerPerfil, 
    registrarMecanico,
    obtenerOrdenesPendientes, 
    obtenerMisOrdenesActivas,
    obtenerOrdenPorId,
    tomarOrden,
    actualizarOrdenCompleta,
    obtenerHistorialMecanico,
    registrarTrabajo
};