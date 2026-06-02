const { supabasePool } = require('../config/supabase');

class ClienteModel {
    static async findAll() {
        const result = await supabasePool.query(
            'SELECT id_cliente, nombre, apellido, telefono, email, usuario FROM Cliente ORDER BY id_cliente'
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await supabasePool.query(
            'SELECT id_cliente, nombre, apellido, telefono, email, usuario FROM Cliente WHERE id_cliente = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByUsuario(usuario) {
        const result = await supabasePool.query(
            'SELECT * FROM Cliente WHERE usuario = $1',
            [usuario]
        );
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, apellido, telefono, email, usuario, contrasena } = data;
        const result = await supabasePool.query(
            `INSERT INTO Cliente (nombre, apellido, telefono, email, usuario, contrasena)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id_cliente, nombre, apellido, usuario`,
            [nombre, apellido, telefono, email, usuario, contrasena]
        );
        return result.rows[0];
    }

    static async exists(usuario) {
        const result = await supabasePool.query(
            'SELECT id_cliente FROM Cliente WHERE usuario = $1',
            [usuario]
        );
        return result.rows.length > 0;
    }

    static async getVehiculos(clienteId) {
        const result = await supabasePool.query(
            'SELECT * FROM Vehiculos WHERE cliente_id = $1 ORDER BY id_vehiculo',
            [clienteId]
        );
        return result.rows;
    }

    static async login(usuario, contrasena) {
        const result = await supabasePool.query(
            `SELECT id_cliente, nombre, apellido, usuario, 'cliente' as rol 
             FROM Cliente WHERE usuario = $1 AND contrasena = $2`,
            [usuario, contrasena]
        );
        return result.rows[0];
    }
}

module.exports = ClienteModel;