const contenedor = document.getElementById('lista-configuracion');

function renderizarConfiguracion() {
    contenedor.innerHTML = '';
    const cultivos = API.obtenerDatos();
    cultivos.forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>Área ${index + 1}: ${c.nombre}</h3>
            <div class="form-group" style="margin-top: 10px;">
                <label>Estado del Área</label>
                <select class="select-estado" data-id="${c.id}">
                    <option value="Activa" ${c.estado === 'Activa' || c.estado === 'NORMAL' ? 'selected' : ''}>Activa</option>
                    <option value="Deshabilitada" ${c.estado === 'Deshabilitada' ? 'selected' : ''}>Deshabilitada</option>
                </select>
            </div>
            <div class="form-group">
                <label><input type="checkbox" class="chk-riego" data-id="${c.id}" checked> Sistema de riego</label><br>
                <label><input type="checkbox" class="chk-sensor" data-id="${c.id}" checked> Sensores</label><br>
                <label><input type="checkbox" class="chk-luz" data-id="${c.id}"> Iluminación</label>
            </div>
            <div class="form-group">
                <label>Tiempo de riego (horas)</label>
                <input type="number" class="input-tiempo" data-id="${c.id}" value="${c.riego}">
            </div>
        `;
        contenedor.appendChild(card);
    });
    asignarEventos();
}

function asignarEventos() {
    document.querySelectorAll('.select-estado').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            API.actualizarDato(id, { estado: e.target.value });
            alert(`Estado actualizado a ${e.target.value}`);
        });
    });
    document.querySelectorAll('.chk-riego').forEach(chk => {
        chk.addEventListener('change', (e) => {
            console.log(`Riego ${e.target.checked ? 'activado' : 'desactivado'} para id: ${e.target.dataset.id}`);
        });
    });
    document.querySelectorAll('.input-tiempo').forEach(input => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const id = parseInt(e.target.dataset.id);
                API.actualizarDato(id, { riego: parseInt(e.target.value) });
                alert('Tiempo de riego actualizado');
            }
        });
    });
}

renderizarConfiguracion();