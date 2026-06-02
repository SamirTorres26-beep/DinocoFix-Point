const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
        require: true
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a Supabase:', err.message);
    } else {
        console.log('Conectado a Supabase');
        release();
    }
});

module.exports = { supabasePool: pool };