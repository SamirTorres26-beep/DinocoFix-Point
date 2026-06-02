const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
    }
};

module.exports = connectMongoDB;