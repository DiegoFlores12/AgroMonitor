require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutasCultivos = require('./routes/cultivos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cultivos', rutasCultivos);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor AgroMonitor corriendo en el puerto ${PORT}`);
});