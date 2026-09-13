const db = require('../config/database');

// --- NOTIFICACIONES ---
exports.getNotificaciones = async (req, res) => {
    const { rol } = req.user;
    try {
        const result = await db.query(
            "SELECT * FROM notificaciones WHERE rol_destino = $1 OR rol_destino = 'all' ORDER BY fecha_envio DESC",
            [rol]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.crearNotificacion = async (req, res) => {
    const { titulo, mensaje, rol_destino } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO notificaciones (titulo, mensaje, rol_destino) VALUES ($1, $2, $3) RETURNING id',
            [titulo, mensaje, rol_destino]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ACTIVIDADES EXTRA ---
exports.getActividadesExtra = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM actividades_extra');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.inscribirActividad = async (req, res) => {
    const { alumno_id, actividad_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO inscripciones_extra (alumno_id, actividad_id) VALUES ($1, $2) RETURNING id',
            [alumno_id, actividad_id]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
