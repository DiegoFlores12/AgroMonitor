const grid = document.getElementById('dashboard-grid');
const tabla = document.getElementById('tabla-monitoreo');
const historialContenedor = document.getElementById('lista-alertas-historial');
let cultivos = API.obtenerDatos();
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
        
        const timestamp = new Date().toLocaleTimeString();
        const item = document.createElement('div');
        item.className = 'alerta-item';
        item.innerHTML = `<strong>[${timestamp}]</strong> Área ${cultivo}: ${problema}`;
        historialContenedor.insertBefore(item, historialContenedor.firstChild);
    }
}

function actualizarEstadisticas() {
    const activos = cultivos.filter(c => c.estado !== 'Deshabilitada');
    document.getElementById('stat-total').textContent = cultivos.length;
    
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

    cultivos.forEach((c, index) => {
        const estado = evaluarEstado(c.temp, c.humSuelo, c.humAire, c.estado, c.nombre);
        
        const card = document.createElement('div');
        card.className = `card ${estado.clase}`;
        card.innerHTML = `
            <h3>Área ${index + 1}: ${c.nombre}</h3>
            <p><strong>Temperatura:</strong> ${c.temp}°C</p>
            <p><strong>Humedad Aire:</strong> ${c.humAire}%</p>
            <p><strong>Humedad Suelo:</strong> ${c.humSuelo}%</p>
            <p><strong>Riego:</strong> cada ${c.riego} horas</p>
            <p><strong>Estado:</strong> ${estado.texto}</p>
        `;
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

setInterval(() => {
    cultivos = cultivos.map(c => {
        if (c.estado !== 'Deshabilitada') {
            c.temp = parseInt(c.temp) + (Math.floor(Math.random() * 3) - 1);
            c.humSuelo = parseInt(c.humSuelo) + (Math.floor(Math.random() * 3) - 1);
        }
        return c;
    });
    renderizarDashboard();
}, 3000);

renderizarDashboard();