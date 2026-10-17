const db = require('../config/db');

const Usuario = {
    registrarSiNoExiste: async (authSubject) => {
        if (typeof authSubject !== 'string' || !authSubject.trim()) {
            throw new Error('Se requiere un identificador autenticado válido.');
        }

        const subject = authSubject.trim();
        const insertado = await db.query(
            `INSERT INTO agro_usuarios_roles (auth_subject, rol)
             VALUES ($1, 'usuario')
             ON CONFLICT (auth_subject) DO NOTHING
             RETURNING auth_subject, rol, activo, creado_en`,
            [subject]
        );

        if (insertado.rows[0]) return insertado.rows[0];

        const existente = await db.query(
            `SELECT auth_subject, rol, activo, creado_en
             FROM agro_usuarios_roles
             WHERE auth_subject = $1`,
            [subject]
        );
        return existente.rows[0] || null;
    },

    obtenerActivo: async (authSubject) => {
        const result = await db.query(
            `SELECT auth_subject, rol, activo, creado_en
             FROM agro_usuarios_roles
             WHERE auth_subject = $1 AND activo = TRUE`,
            [authSubject]
        );
        return result.rows[0] || null;
    }
};

module.exports = Usuario;