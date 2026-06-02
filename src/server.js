require('dotenv').config();
const app = require('./app');
const connectMongoDB = require('./config/mongodb');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await connectMongoDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();