const { Pool } = require('pg');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
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