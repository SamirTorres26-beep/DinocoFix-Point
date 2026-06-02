const mongoose = require('mongoose');

const ordenServicioSchema = new mongoose.Schema({
    id_OrdenServicio: Number,
    F_entrada: Date,
    F_Salida: Date,
    Estado: { type: String, default: 'Pendiente' },
    Costo: { type: Number, default: 0 },
    Observaciones: String,
    id_MecanicoFK: Number,
    id_VehiculoFK: Number,
    Cita: {
        id_Cita: Number,
        FechaCita: Date,
        HoraCita: String,
        Motivo: String,
        Estado: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrdenServicio', ordenServicioSchema);