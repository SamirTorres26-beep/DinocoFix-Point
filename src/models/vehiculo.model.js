const { supabasePool } = require('../config/supabase');

class VehiculoModel {
    static async findAll() {
        const result = await supabasePool.query(
            `SELECT v.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido 
             FROM Vehiculos v 
             JOIN Cliente c ON v.cliente_id = c.id_cliente 
             ORDER BY v.id_vehiculo`
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await supabasePool.query(
            'SELECT * FROM Vehiculos WHERE id_vehiculo = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByCliente(clienteId) {
        const result = await supabasePool.query(
            'SELECT * FROM Vehiculos WHERE cliente_id = $1 ORDER BY id_vehiculo',
            [clienteId]
        );
        return result.rows;
    }

    static async findByPlaca(placa) {
        const result = await supabasePool.query(
            'SELECT * FROM Vehiculos WHERE placa = $1',
            [placa]
        );
        return result.rows[0];
    }

    static async create(data) {
        const { cliente_id, marca, modelo, anio, placa, color } = data;
        const result = await supabasePool.query(
            `INSERT INTO Vehiculos (cliente_id, marca, modelo, anio, placa, color)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [cliente_id, marca, modelo, anio, placa, color]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { marca, modelo, anio, placa, color } = data;
        const result = await supabasePool.query(
            `UPDATE Vehiculos SET marca = $1, modelo = $2, anio = $3, placa = $4, color = $5
             WHERE id_vehiculo = $6`,
            [marca, modelo, anio, placa, color, id]
        );
        return result.rowCount > 0;
    }

    static async delete(id) {
        const result = await supabasePool.query(
            'DELETE FROM Vehiculos WHERE id_vehiculo = $1',
            [id]
        );
        return result.rowCount > 0;
    }

    static async belongsToCliente(vehiculoId, clienteId) {
        const result = await supabasePool.query(
            'SELECT id_vehiculo FROM Vehiculos WHERE id_vehiculo = $1 AND cliente_id = $2',
            [vehiculoId, clienteId]
        );
        return result.rows.length > 0;
    }
}

module.exports = VehiculoModel;