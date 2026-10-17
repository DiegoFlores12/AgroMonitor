const API_BASE_URL = (window.AGROMONITOR_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
const LOCAL_CULTIVOS_KEY = 'agromonitor_cultivos_demo';
let modoLocal = false;

const CULTIVOS_DEMO = [
    { id: 1, nombre: 'Tomates - Invernadero 1', temperatura: 25.8, humedad_aire: 62, humedad_suelo: 48, riego: 6, tamano: 120, estado: 'Activa', riego_activo: true, sensores_activos: true, luz_activa: false },
    { id: 2, nombre: 'Lechugas - Sector norte', temperatura: 24.1, humedad_aire: 58, humedad_suelo: 22, riego: 4, tamano: 85, estado: 'Activa', riego_activo: true, sensores_activos: true, luz_activa: false },
    { id: 3, nombre: 'Frutillas - Parcela 3', temperatura: 21.6, humedad_aire: 66, humedad_suelo: 54, riego: 8, tamano: 160, estado: 'Deshabilitada', riego_activo: false, sensores_activos: false, luz_activa: true }
];

function obtenerCultivosLocales() {
    try {
        const guardados = JSON.parse(localStorage.getItem(LOCAL_CULTIVOS_KEY) || 'null');
        if (Array.isArray(guardados)) return guardados;
    } catch {
        localStorage.removeItem(LOCAL_CULTIVOS_KEY);
    }

    localStorage.setItem(LOCAL_CULTIVOS_KEY, JSON.stringify(CULTIVOS_DEMO));
    return CULTIVOS_DEMO;
}

function operarCultivosLocales(ruta, opciones) {
    const metodo = opciones.method || 'GET';
    const cultivos = obtenerCultivosLocales();
    const id = ruta ? Number(decodeURIComponent(ruta.slice(1))) : null;

    if (metodo === 'GET') return cultivos;
    if (metodo === 'POST') {
        const datos = JSON.parse(opciones.body || '{}');
        const nuevo = { ...datos, id: Math.max(0, ...cultivos.map(cultivo => Number(cultivo.id) || 0)) + 1 };
        cultivos.push(nuevo);
        localStorage.setItem(LOCAL_CULTIVOS_KEY, JSON.stringify(cultivos));
        return nuevo;
    }

    const indice = cultivos.findIndex(cultivo => Number(cultivo.id) === id);
    if (indice < 0) throw new Error('No se encontró el cultivo solicitado.');

    if (metodo === 'PATCH') {
        const datos = JSON.parse(opciones.body || '{}');
        cultivos[indice] = { ...cultivos[indice], ...datos };
        localStorage.setItem(LOCAL_CULTIVOS_KEY, JSON.stringify(cultivos));
        return cultivos[indice];
    }

    if (metodo === 'DELETE') {
        cultivos.splice(indice, 1);
        localStorage.setItem(LOCAL_CULTIVOS_KEY, JSON.stringify(cultivos));
        return null;
    }

    throw new Error(`Método no permitido: ${metodo}`);
}

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
    if (modoLocal) return operarCultivosLocales(ruta, opciones);

    let respuesta;
    try {
        respuesta = await fetch(`${API_BASE_URL}/cultivos${ruta}`, {
            ...opciones,
            headers: {
                ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
                ...opciones.headers
            }
        });
    } catch (error) {
        if (!(error instanceof TypeError)) throw error;
        modoLocal = true;
        return operarCultivosLocales(ruta, opciones);
    }

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
    },
    estaEnModoLocal: () => modoLocal
};