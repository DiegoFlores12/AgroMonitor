const API_BASE_URL = (window.AGROMONITOR_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

function normalizarCultivo(cultivo) {
    return {
        id: Number(cultivo.id),
        nombre: cultivo.nombre,
        temp: Number(cultivo.temperatura ?? cultivo.temp ?? 0),
        humAire: Number(cultivo.humedad_aire ?? cultivo.humAire ?? 0),
        humSuelo: Number(cultivo.humedad_suelo ?? cultivo.humSuelo ?? 0),
        riego: Number(cultivo.riego ?? 0),
        tamano: Number(cultivo.tamano ?? 0),
        estado: cultivo.estado || 'Activa',
        riego_activo: cultivo.riego_activo ?? true,
        sensores_activos: cultivo.sensores_activos ?? true,
        luz_activa: cultivo.luz_activa ?? false
    };
}

function serializarCultivo(datos) {
    const alias = {
        temp: 'temperatura',
        humAire: 'humedad_aire',
        humSuelo: 'humedad_suelo'
    };
    const serializado = {};

    Object.entries(datos).forEach(([campo, valor]) => {
        if (campo === 'id') return;
        serializado[alias[campo] || campo] = valor;
    });

    return serializado;
}

async function solicitarCultivos(ruta = '', opciones = {}) {
    const respuesta = await fetch(`${API_BASE_URL}/cultivos${ruta}`, {
        ...opciones,
        headers: {
            ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
            ...opciones.headers
        }
    });
    const cuerpo = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        throw new Error(cuerpo?.error || `La solicitud falló (${respuesta.status}).`);
    }

    return cuerpo;
}

const API = {
    async obtenerDatos() {
        const cultivos = await solicitarCultivos();
        return cultivos.map(normalizarCultivo);
    },
    async guardarDato(nuevoCultivo) {
        const cultivo = await solicitarCultivos('', {
            method: 'POST',
            body: JSON.stringify(serializarCultivo(nuevoCultivo))
        });
        return normalizarCultivo(cultivo);
    },
    async actualizarDato(id, datosActualizados) {
        const cultivo = await solicitarCultivos(`/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: JSON.stringify(serializarCultivo(datosActualizados))
        });
        return normalizarCultivo(cultivo);
    },
    async eliminarDato(id) {
        await solicitarCultivos(`/${encodeURIComponent(id)}`, { method: 'DELETE' });
    }
};