CREATE TABLE cultivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    temperatura DECIMAL(5,2),
    humedad_aire DECIMAL(5,2),
    humedad_suelo DECIMAL(5,2),
    riego INT,
    tamano DECIMAL(10,2),
    estado VARCHAR(50)
);