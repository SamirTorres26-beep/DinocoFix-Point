const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_para_DinocoFxP_2026';

const generarToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};

const verificarToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generarToken, verificarToken };