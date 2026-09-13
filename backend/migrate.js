// Aplica backend/src/config/schema.sql contra la base configurada en DATABASE_URL.
// Es idempotente (CREATE TABLE IF NOT EXISTS), por lo que es seguro correrlo
// más de una vez (ej. en cada deploy) sin duplicar ni romper datos existentes.
const fs = require('fs');
const path = require('path');
const db = require('./src/config/database');

async function migrate() {
    const schema = fs.readFileSync(path.join(__dirname, 'src/config/schema.sql'), 'utf8');
    try {
        await db.query(schema);
        console.log('Esquema de PostgreSQL verificado/actualizado correctamente.');
    } catch (err) {
        console.error('Error al ejecutar la migración:', err.message);
        process.exitCode = 1;
    }
}

if (require.main === module) {
    migrate();
}

module.exports = migrate;
