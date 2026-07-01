const grid = document.getElementById('dashboard-grid');
const tabla = document.getElementById('tabla-monitoreo');
let cultivos = API.obtenerDatos();

function evaluarEstado(temp, humSuelo, humAire, estadoFijo) {
    if (estadoFijo === 'Deshabilitada') return { clase: 'inactiva', texto: '⚪ Deshabilitada' };
    if (temp > 32) return { clase: 'alerta', texto: '🔴 Temperatura Alta' };
    if (humSuelo < 25) return { clase: 'alerta', texto: '🔴 Falta de agua' };
    if (humAire > 90) return { clase: 'alerta', texto: '🔴 Exceso de humedad' };
    return { clase: '', texto: '🟢 NORMAL' };
}

function renderizarDashboard() {
    grid.innerHTML = '';
    tabla.innerHTML = '';
    cultivos.forEach((c, index) => {
        const estado = evaluarEstado(c.temp, c.humSuelo, c.humAire, c.estado);
        const card = document.createElement('div');
        card.className = `card ${estado.clase}`;
        card.innerHTML = `
            <h3>Área ${index + 1}: ${c.nombre}</h3>
            <p><strong>Cultivo:</strong> ${c.nombre}</p>
            <p><strong>Temperatura:</strong> ${c.temp}°C</p>
            <p><strong>Humedad Aire:</strong> ${c.humAire}%</p>
            <p><strong>Humedad Suelo:</strong> ${c.humSuelo}%</p>
            <p><strong>Riego:</strong> cada ${c.riego} horas</p>
            <p><strong>Tamaño:</strong> ${c.tamano} m²</p>
            <p><strong>Estado:</strong> ${estado.texto}</p>
            <p style="font-size: 0.8rem; margin-top:10px; color:#666;">📝 ${c.notas || 'Sin hardware asignado'}</p>
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