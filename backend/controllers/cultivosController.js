const Cultivo = require('../models/cultivoModel');

exports.obtenerCultivos = async (req, res) => {
    try {
        const cultivos = await Cultivo.obtenerTodos();
        res.json(cultivos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearCultivo = async (req, res) => {
    try {
        const nuevoCultivo = await Cultivo.crear(req.body);
        res.status(201).json(nuevoCultivo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};