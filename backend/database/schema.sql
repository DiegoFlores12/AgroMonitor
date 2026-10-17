CREATE TABLE IF NOT EXISTS cultivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    temperatura DECIMAL(5,2),
    humedad_aire DECIMAL(5,2),
    humedad_suelo DECIMAL(5,2),
    riego INT,
    tamano DECIMAL(10,2),
    estado VARCHAR(50),
    riego_activo BOOLEAN NOT NULL DEFAULT TRUE,
    sensores_activos BOOLEAN NOT NULL DEFAULT TRUE,
    luz_activa BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE cultivos
    ADD COLUMN IF NOT EXISTS riego_activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS sensores_activos BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS luz_activa BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS agro_usuarios_roles (
    auth_subject TEXT PRIMARY KEY,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario'
        CHECK (rol IN ('administrador', 'usuario')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE agro_usuarios_roles
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS agro_usuarios_roles_un_solo_admin
    ON agro_usuarios_roles (rol)
    WHERE rol = 'administrador';