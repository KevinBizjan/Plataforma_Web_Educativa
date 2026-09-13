const { Pool, types } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Por defecto pg-node devuelve NUMERIC/DECIMAL y BIGINT como strings (para no
// perder precisión) y DATE como objeto Date. SQLite devolvía todo esto como
// texto/número plano, y el frontend ya asume ese formato (ej. <input
// type="date" defaultValue={alumno.fecha_nacimiento}> necesita 'YYYY-MM-DD'
// exacto). Se ajustan los parsers para mantener el mismo comportamiento.
types.setTypeParser(1082, (val) => val); // DATE -> 'YYYY-MM-DD' (string, no Date)
types.setTypeParser(1700, (val) => parseFloat(val)); // NUMERIC/DECIMAL -> number
types.setTypeParser(20, (val) => parseInt(val, 10)); // BIGINT (ej. COUNT(*)) -> number

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

// Crea las tablas si no existen (schema.sql usa CREATE TABLE IF NOT EXISTS,
// por lo que es seguro ejecutarlo en cada arranque del servidor).
async function initializeDatabase() {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    try {
        await pool.query(schema);
        console.log('Conectado a PostgreSQL (Supabase) y esquema verificado.');
    } catch (err) {
        console.error('Error al inicializar el esquema de la base de datos:', err.message);
    }
}

initializeDatabase();

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};
