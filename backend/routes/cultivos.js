const express = require('express');
const router = express.Router();
const cultivosController = require('../controllers/cultivosController');

router.get('/', cultivosController.obtenerCultivos);
router.post('/', cultivosController.crearCultivo);

module.exports = router;