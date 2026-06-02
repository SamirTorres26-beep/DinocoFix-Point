const { ClienteModel, MecanicoModel } = require('../models');
const { generarToken } = require('../config/auth');

const login = async (req, res) => {
    try {
        const { usuario, contrasena, rol } = req.body;

        let user = null;

        if (rol === 'cliente') {
            user = await ClienteModel.login(usuario, contrasena);
        } else if (rol === 'mecanico') {
            user = await MecanicoModel.login(usuario, contrasena);
        }

        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = generarToken({
            id: user.id_cliente || user.id_mecanico,
            usuario: user.usuario,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido
        });

        res.json({ token, rol: user.rol, usuario: user.usuario });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { login };