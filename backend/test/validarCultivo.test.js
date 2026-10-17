const test = require('node:test');
const assert = require('node:assert/strict');
const validarCultivo = require('../utils/validarCultivo');

test('acepta un cultivo válido', () => {
    assert.equal(validarCultivo({
        nombre: 'Tomates',
        temperatura: 24,
        humedad_aire: 68,
        humedad_suelo: 73,
        riego: 5,
        tamano: 250,
        estado: 'Activa',
        riego_activo: true,
        sensores_activos: true,
        luz_activa: false
    }), null);
});

test('rechaza temperaturas y humedades fuera de rango', () => {
    const errores = validarCultivo({ nombre: 'Tomates', temperatura: 51, humedad_aire: -1 });
    assert.ok(errores.temperatura);
    assert.ok(errores.humedad_aire);
});

test('permite actualizaciones parciales con campos válidos', () => {
    assert.equal(validarCultivo({ riego: 8 }, { parcial: true }), null);
});

test('acepta estados booleanos y rechaza valores no booleanos', () => {
    assert.equal(validarCultivo({ riego_activo: false }, { parcial: true }), null);
    assert.ok(validarCultivo({ luz_activa: 'sí' }, { parcial: true }).luz_activa);
});

test('rechaza campos no permitidos y actualizaciones vacías', () => {
    assert.ok(validarCultivo({ notas: 'texto' }, { parcial: true }).notas);
    assert.ok(validarCultivo({}, { parcial: true }).cuerpo);
});