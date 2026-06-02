const { supabasePool } = require('../config/supabase');

class MecanicoModel {
    static async findAll() {
        const result = await supabasePool.query(
            'SELECT id_mecanico, nombre, apellido, telefono, email, usuario FROM Mecanico ORDER BY id_mecanico'
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await supabasePool.query(
            'SELECT id_mecanico, nombre, apellido, telefono, email, usuario FROM Mecanico WHERE id_mecanico = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByUsuario(usuario) {
        const result = await supabasePool.query(
            'SELECT * FROM Mecanico WHERE usuario = $1',
            [usuario]
        );
        return result.rows[0];
    }

    static async create(data) {
        const { nombre, apellido, telefono, email, usuario, contrasena } = data;
        const result = await supabasePool.query(
            `INSERT INTO Mecanico (nombre, apellido, telefono, email, usuario, contrasena)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id_mecanico, nombre, apellido, usuario`,
            [nombre, apellido, telefono, email, usuario, contrasena]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { nombre, apellido, telefono, email } = data;
        const result = await supabasePool.query(
            `UPDATE Mecanico SET nombre = $1, apellido = $2, telefono = $3, email = $4
             WHERE id_mecanico = $5`,
            [nombre, apellido, telefono, email, id]
        );
        return result.rowCount > 0;
    }

    static async login(usuario, contrasena) {
        const result = await supabasePool.query(
            `SELECT id_mecanico, nombre, apellido, usuario, 'mecanico' as rol 
             FROM Mecanico WHERE usuario = $1 AND contrasena = $2`,
            [usuario, contrasena]
        );
        return result.rows[0];
    }
}

module.exports = MecanicoModel;