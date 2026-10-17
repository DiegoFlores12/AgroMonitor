const camposPermitidos = new Set([
    'nombre',
    'temperatura',
    'humedad_aire',
    'humedad_suelo',
    'riego',
    'tamano',
    'estado',
    'riego_activo',
    'sensores_activos',
    'luz_activa'
]);

const rangosNumericos = {
    temperatura: { minimo: 0, maximo: 50 },
    humedad_aire: { minimo: 0, maximo: 100 },
    humedad_suelo: { minimo: 0, maximo: 100 },
    riego: { minimo: 1, maximo: 8760, entero: true },
    tamano: { minimo: 0, maximo: 99999999.99 }
};

const estadosPermitidos = new Set(['Activa', 'Deshabilitada', 'NORMAL', 'ALERTA']);

function validarCultivo(datos, { parcial = false } = {}) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        return { cuerpo: 'El cuerpo debe ser un objeto JSON.' };
    }

    const errores = {};
    const campos = Object.keys(datos);

    for (const campo of campos) {
        if (!camposPermitidos.has(campo)) errores[campo] = 'Este campo no está permitido.';
    }

    if (parcial && campos.length === 0) {
        errores.cuerpo = 'Debes enviar al menos un campo para actualizar.';
    }

    if (!parcial || Object.hasOwn(datos, 'nombre')) {
        if (typeof datos.nombre !== 'string' || !datos.nombre.trim() || datos.nombre.trim().length > 100) {
            errores.nombre = 'El nombre es obligatorio y debe tener como máximo 100 caracteres.';
        }
    }

    for (const [campo, rango] of Object.entries(rangosNumericos)) {
        if (!Object.hasOwn(datos, campo)) continue;
        const valor = datos[campo];
        if (typeof valor !== 'number' || !Number.isFinite(valor)
            || valor < rango.minimo || valor > rango.maximo
            || (rango.entero && !Number.isInteger(valor))) {
            errores[campo] = `Debe ser un número entre ${rango.minimo} y ${rango.maximo}${rango.entero ? ' (entero)' : ''}.`;
        }
    }

    if (Object.hasOwn(datos, 'estado') && !estadosPermitidos.has(datos.estado)) {
        errores.estado = 'El estado no es válido.';
    }

    for (const campo of ['riego_activo', 'sensores_activos', 'luz_activa']) {
        if (Object.hasOwn(datos, campo) && typeof datos[campo] !== 'boolean') {
            errores[campo] = 'Debe ser un valor booleano.';
        }
    }

    return Object.keys(errores).length ? errores : null;
}

module.exports = validarCultivo;