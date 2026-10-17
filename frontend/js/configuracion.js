const contenedor = document.getElementById('lista-configuracion');

async function renderizarConfiguracion() {
    contenedor.innerHTML = '';
    try {
        const cultivos = await API.obtenerDatos();
        cultivos.forEach((cultivo, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3></h3>
                <div class="form-group" style="margin-top: 10px;">
                    <label>Estado del Área</label>
                    <select class="select-estado">
                        <option value="Activa">Activa</option>
                        <option value="Deshabilitada">Deshabilitada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><input type="checkbox" class="chk-riego"> Sistema de riego</label><br>
                    <label><input type="checkbox" class="chk-sensor"> Sensores</label><br>
                    <label><input type="checkbox" class="chk-luz"> Iluminación</label>
                </div>
                <div class="form-group">
                    <label>Tiempo de riego (horas)</label>
                    <input type="number" class="input-tiempo" min="1" max="8760">
                </div>
            `;
            card.querySelector('h3').textContent = `Área ${index + 1}: ${cultivo.nombre}`;
            const estado = card.querySelector('.select-estado');
            estado.value = cultivo.estado === 'Deshabilitada' ? 'Deshabilitada' : 'Activa';
            estado.dataset.id = cultivo.id;
            card.querySelector('.chk-riego').checked = cultivo.riego_activo;
            card.querySelector('.chk-riego').dataset.id = cultivo.id;
            card.querySelector('.chk-sensor').checked = cultivo.sensores_activos;
            card.querySelector('.chk-sensor').dataset.id = cultivo.id;
            card.querySelector('.chk-luz').checked = cultivo.luz_activa;
            card.querySelector('.chk-luz').dataset.id = cultivo.id;
            card.querySelector('.input-tiempo').value = cultivo.riego;
            card.querySelector('.input-tiempo').dataset.id = cultivo.id;
            contenedor.appendChild(card);
        });
        asignarEventos();
    } catch (error) {
        contenedor.textContent = `No se pudo cargar la configuración: ${error.message}`;
    }
}

function asignarEventos() {
    document.querySelectorAll('.select-estado').forEach((select) => {
        select.addEventListener('change', async (evento) => {
            try {
                await API.actualizarDato(Number(evento.target.dataset.id), { estado: evento.target.value });
            } catch (error) {
                alert(`No se pudo actualizar el estado: ${error.message}`);
                await renderizarConfiguracion();
            }
        });
    });

    [
        ['.chk-riego', 'riego_activo'],
        ['.chk-sensor', 'sensores_activos'],
        ['.chk-luz', 'luz_activa']
    ].forEach(([selector, campo]) => {
        document.querySelectorAll(selector).forEach((checkbox) => {
            checkbox.addEventListener('change', async (evento) => {
                try {
                    await API.actualizarDato(Number(evento.target.dataset.id), { [campo]: evento.target.checked });
                } catch (error) {
                    alert(`No se pudo guardar la configuración: ${error.message}`);
                    await renderizarConfiguracion();
                }
            });
        });
    });

    document.querySelectorAll('.input-tiempo').forEach((input) => {
        input.addEventListener('change', async (evento) => {
            const riego = Number(evento.target.value);
            if (!Number.isInteger(riego) || riego < 1 || riego > 8760) {
                alert('El tiempo de riego debe ser un entero entre 1 y 8760 horas.');
                await renderizarConfiguracion();
                return;
            }
            try {
                await API.actualizarDato(Number(evento.target.dataset.id), { riego });
            } catch (error) {
                alert(`No se pudo actualizar el tiempo de riego: ${error.message}`);
                await renderizarConfiguracion();
            }
        });
    });
}

renderizarConfiguracion();