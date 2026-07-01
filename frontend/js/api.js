const DB_KEY = 'agromonitor_cultivos';
const API = {
    obtenerDatos: () => {
        let datos = localStorage.getItem(DB_KEY);
        if (!datos) {
            const iniciales = [
                { id: 1, nombre: 'Tomates', temp: 24, humAire: 68, humSuelo: 73, riego: 5, tamano: 250, estado: 'NORMAL', notas: 'Ninguno' },
                { id: 2, nombre: 'Manzana', temp: 35, humAire: 21, humSuelo: 18, riego: 12, tamano: 400, estado: 'ALERTA', notas: 'Estructura de cartón piedra con Arduino Uno, ESP32 y servos SG90' }
            ];
            localStorage.setItem(DB_KEY, JSON.stringify(iniciales));
            return iniciales;
        }
        return JSON.parse(datos);
    },
    guardarDato: (nuevoCultivo) => {
        const datos = API.obtenerDatos();
        datos.push(nuevoCultivo);
        localStorage.setItem(DB_KEY, JSON.stringify(datos));
    },
    actualizarDato: (id, datosActualizados) => {
        let datos = API.obtenerDatos();
        const index = datos.findIndex(c => c.id === id);
        if (index !== -1) {
            datos[index] = { ...datos[index], ...datosActualizados };
            localStorage.setItem(DB_KEY, JSON.stringify(datos));
        }
    },
    eliminarDato: (id) => {
        let datos = API.obtenerDatos();
        datos = datos.filter(c => c.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(datos));
    }
};