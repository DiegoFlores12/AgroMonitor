const db = require('../config/db');

const Cultivo = {
    obtenerTodos: async () => {
        const result = await db.query('SELECT * FROM cultivos ORDER BY id ASC');
        return result.rows;
    },
    crear: async (datos) => {
        const { nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado } = datos;
        const result = await db.query(
            'INSERT INTO cultivos (nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado]
        );
        return result.rows[0];
    }
};

module.exports = Cultivo;