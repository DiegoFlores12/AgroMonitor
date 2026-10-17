const Cultivo = require('../models/cultivoModel');
const validarCultivo = require('../utils/validarCultivo');

function obtenerId(req) {
    if (!/^\d+$/.test(req.params.id)) return null;
    const id = Number(req.params.id);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function responderErrorValidacion(res, errores) {
    return res.status(400).json({
        error: 'Los datos enviados no son válidos.',
        detalles: errores
    });
}

exports.obtenerCultivos = async (req, res) => {
    try {
        const cultivos = await Cultivo.obtenerTodos();
        return res.json(cultivos);
    } catch (error) {
        console.error('Error al obtener cultivos:', error.message);
        return res.status(500).json({ error: 'No se pudieron obtener los cultivos.' });
    }
};

exports.crearCultivo = async (req, res) => {
    const errores = validarCultivo(req.body);
    if (errores) return responderErrorValidacion(res, errores);

    try {
        const nuevoCultivo = await Cultivo.crear(req.body);
        return res.status(201).json(nuevoCultivo);
    } catch (error) {
        console.error('Error al crear cultivo:', error.message);
        return res.status(500).json({ error: 'No se pudo crear el cultivo.' });
    }
};

exports.actualizarCultivo = async (req, res) => {
    const id = obtenerId(req);
    if (!id) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });

    const errores = validarCultivo(req.body, { parcial: true });
    if (errores) return responderErrorValidacion(res, errores);

    try {
        const cultivo = await Cultivo.actualizar(id, req.body);
        if (!cultivo) return res.status(404).json({ error: 'No se encontró el cultivo.' });
        return res.json(cultivo);
    } catch (error) {
        console.error('Error al actualizar cultivo:', error.message);
        return res.status(500).json({ error: 'No se pudo actualizar el cultivo.' });
    }
};

exports.eliminarCultivo = async (req, res) => {
    const id = obtenerId(req);
    if (!id) return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });

    try {
        const cultivo = await Cultivo.eliminar(id);
        if (!cultivo) return res.status(404).json({ error: 'No se encontró el cultivo.' });
        return res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar cultivo:', error.message);
        return res.status(500).json({ error: 'No se pudo eliminar el cultivo.' });
    }
};