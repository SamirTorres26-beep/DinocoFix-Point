const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    id_Registro: Number,
    Fecha: { type: Date, default: Date.now },
    CostoFinal: Number,
    Descripcion: String,
    MecanicoEncargado: String,
    id_MecanicoFK: Number,
    id_VehiculoFK: Number,
    progreso: { type: Number, default: 0 },
    tareas_realizadas: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Registro', registroSchema);