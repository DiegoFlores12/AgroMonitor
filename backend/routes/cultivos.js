const express = require('express');
const router = express.Router();
const cultivosController = require('../controllers/cultivosController');

router.get('/', cultivosController.obtenerCultivos);
router.post('/', cultivosController.crearCultivo);
router.patch('/:id', cultivosController.actualizarCultivo);
router.delete('/:id', cultivosController.eliminarCultivo);

module.exports = router;