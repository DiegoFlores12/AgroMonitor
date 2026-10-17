require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutasCultivos = require('./routes/cultivos');

const app = express();
const originsConfigurados = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);
const originsDesarrollo = process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5500', 'http://127.0.0.1:5500'];
const originsPermitidos = new Set([...originsConfigurados, ...originsDesarrollo]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || originsPermitidos.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Origen no permitido por CORS.'));
    }
}));
app.use(express.json({ limit: '32kb' }));

app.use('/api/cultivos', rutasCultivos);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ error: 'La solicitud excede el tamaño permitido.' });
    }

    const status = error.status >= 400 && error.status < 500 ? error.status : 500;
    const mensaje = status === 500 ? 'Error interno del servidor.' : error.message;
    return res.status(status).json({ error: mensaje });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor AgroMonitor corriendo en el puerto ${PORT}`);
});