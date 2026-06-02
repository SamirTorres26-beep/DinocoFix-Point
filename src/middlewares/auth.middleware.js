const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_para_DinocoFxP_2026';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

module.exports = { verificarToken };