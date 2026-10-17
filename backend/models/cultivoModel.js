const db = require('../config/db');

const columnasPermitidas = {
    nombre: 'nombre',
    temperatura: 'temperatura',
    humedad_aire: 'humedad_aire',
    humedad_suelo: 'humedad_suelo',
    riego: 'riego',
    tamano: 'tamano',
    estado: 'estado',
    riego_activo: 'riego_activo',
    sensores_activos: 'sensores_activos',
    luz_activa: 'luz_activa'
};

const Cultivo = {
    obtenerTodos: async () => {
        const result = await db.query(
            'SELECT id, nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado, riego_activo, sensores_activos, luz_activa FROM cultivos ORDER BY id ASC'
        );
        return result.rows;
    },
    crear: async (datos) => {
        const { nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado } = datos;
        const result = await db.query(
            'INSERT INTO cultivos (nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado, riego_activo, sensores_activos, luz_activa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado, riego_activo, sensores_activos, luz_activa',
            [nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado, datos.riego_activo ?? true, datos.sensores_activos ?? true, datos.luz_activa ?? false]
        );
        return result.rows[0];
    },
    actualizar: async (id, datos) => {
        const cambios = Object.entries(datos).filter(([campo]) => columnasPermitidas[campo]);
        const asignaciones = cambios.map(([campo], index) => `${columnasPermitidas[campo]} = $${index + 1}`);
        const valores = cambios.map(([, valor]) => valor);
        valores.push(id);

        const result = await db.query(
            `UPDATE cultivos SET ${asignaciones.join(', ')} WHERE id = $${valores.length} RETURNING id, nombre, temperatura, humedad_aire, humedad_suelo, riego, tamano, estado, riego_activo, sensores_activos, luz_activa`,
            valores
        );
        return result.rows[0] || null;
    },
    eliminar: async (id) => {
        const result = await db.query('DELETE FROM cultivos WHERE id = $1 RETURNING id', [id]);
        return result.rows[0] || null;
    }
};

module.exports = Cultivo;