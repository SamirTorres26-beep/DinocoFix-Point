const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const mecanicoRoutes = require('./routes/mecanico.routes');
const vehiculoRoutes = require('./routes/vehiculo.routes');
const ordenRoutes = require('./routes/orden.routes');
const registroRoutes = require('./routes/registro.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('frontend'));

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/mecanicos', mecanicoRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/registros', registroRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API DinocoFxP funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            clientes: '/api/clientes',
            mecanicos: '/api/mecanicos',
            vehiculos: '/api/vehiculos',
            ordenes: '/api/ordenes',
            registros: '/api/registros'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

module.exports = app;