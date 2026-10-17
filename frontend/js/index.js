const grid = document.getElementById('dashboard-grid');
const tabla = document.getElementById('tabla-monitoreo');
const historialContenedor = document.getElementById('lista-alertas-historial');
let cultivos = [];
let alertasRegistradas = new Set(); 

function evaluarEstado(temp, humSuelo, humAire, estadoFijo, nombreCultivo) {
    if (estadoFijo === 'Deshabilitada') return { clase: 'inactiva', texto: '⚪ Deshabilitada' };
    
    let mensajeAlerta = '';
    if (temp > 32) mensajeAlerta = '🔴 Temperatura Alta';
    else if (humSuelo < 25) mensajeAlerta = '🔴 Falta de agua';
    else if (humAire > 90) mensajeAlerta = '🔴 Exceso de humedad';

    if (mensajeAlerta) {
        registrarEnHistorial(nombreCultivo, mensajeAlerta);
        return { clase: 'alerta', texto: mensajeAlerta };
    }
    return { clase: '', texto: '🟢 NORMAL' };
}

function registrarEnHistorial(cultivo, problema) {
    const claveAlerta = `${cultivo}-${problema}`;
    if (!alertasRegistradas.has(claveAlerta)) {
        alertasRegistradas.add(claveAlerta);
        
        if (historialContenedor.innerText.includes('No se han registrado alertas')) {
            historialContenedor.innerHTML = '';
        }
        
        const item = document.createElement('div');
        item.className = 'alerta-item';
        const timestamp = document.createElement('strong');
        timestamp.textContent = `[${new Date().toLocaleTimeString()}]`;
        item.append(timestamp, document.createTextNode(` Área ${cultivo}: ${problema}`));
        historialContenedor.insertBefore(item, historialContenedor.firstChild);
    }
}

function variarMuestra(valor, minimo, maximo) {
    const actual = Number(valor);
    const cambio = actual <= minimo ? 1 : actual >= maximo ? -1 : Math.random() < 0.5 ? -1 : 1;
    return Math.max(minimo, Math.min(maximo, actual + cambio));
}

function actualizarEstadisticas() {
    const zonasVisibles = Permisos.zonasVisibles(cultivos);
    const activos = zonasVisibles.filter(c => c.estado !== 'Deshabilitada');
    document.getElementById('stat-total').textContent = zonasVisibles.length;
    
    let alertasCount = 0;
    let sumaTemp = 0;

    activos.forEach(c => {
        sumaTemp += parseFloat(c.temp);
        if (c.temp > 32 || c.humSuelo < 25 || c.humAire > 90) {
            alertasCount++;
        }
    });

    document.getElementById('stat-alertas').textContent = alertasCount;
    const promedio = activos.length > 0 ? (sumaTemp / activos.length).toFixed(1) : 0;
    document.getElementById('stat-promedio').textContent = `${promedio}°C`;
}

function renderizarDashboard() {
    grid.innerHTML = '';
    tabla.innerHTML = '';
    const zonasVisibles = Permisos.zonasVisibles(cultivos);

    if (zonasVisibles.length === 0) {
        grid.innerHTML = '<p>No hay zonas operativas para mostrar.</p>';
    }

    zonasVisibles.forEach((c, index) => {
        const estado = evaluarEstado(c.temp, c.humSuelo, c.humAire, c.estado, c.nombre);
        
        const card = document.createElement('div');
        card.className = `card ${estado.clase}`;
        const titulo = document.createElement('h3');
        titulo.textContent = `Área ${index + 1}: ${c.nombre}`;
        card.appendChild(titulo);

        [
            ['Temperatura:', `${c.temp}°C`],
            ['Humedad Aire:', `${c.humAire}%`],
            ['Humedad Suelo:', `${c.humSuelo}%`],
            ['Riego:', `cada ${c.riego} horas`],
            ['Estado:', estado.texto]
        ].forEach(([etiqueta, valor]) => {
            const parrafo = document.createElement('p');
            const negrita = document.createElement('strong');
            negrita.textContent = etiqueta;
            parrafo.append(negrita, document.createTextNode(` ${valor}`));
            card.appendChild(parrafo);
        });
        grid.appendChild(card);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${c.temp}°C</td>
            <td>${c.humSuelo}%</td>
            <td>${estado.texto}</td>
        `;
        tabla.appendChild(tr);
    });
    actualizarEstadisticas();
}

async function cargarDashboard() {
    try {
        cultivos = await API.obtenerDatos();
        renderizarDashboard();
        setInterval(() => {
            cultivos = cultivos.map((cultivo) => {
                if (cultivo.estado === 'Deshabilitada' || !cultivo.sensores_activos) return cultivo;
                return {
                    ...cultivo,
                    temp: variarMuestra(cultivo.temp, 0, 50),
                    humAire: variarMuestra(cultivo.humAire, 0, 100),
                    humSuelo: variarMuestra(cultivo.humSuelo, 0, 100)
                };
            });
            renderizarDashboard();
        }, 3000);
    } catch (error) {
        grid.textContent = `No se pudieron cargar las áreas: ${error.message}`;
        tabla.replaceChildren();
    }
}

cargarDashboard();