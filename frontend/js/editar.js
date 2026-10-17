const tbody = document.querySelector('#tabla-editar tbody');
const formCaja = document.getElementById('form-editar-caja');
let cultivos = [];

async function cargarTabla() {
    tbody.innerHTML = '';
    try {
        cultivos = await API.obtenerDatos();
        cultivos.forEach((cultivo, index) => {
            const fila = document.createElement('tr');
            fila.id = `fila-cultivo-${cultivo.id}`;
            const area = document.createElement('td');
            area.textContent = `Área ${index + 1}`;
            const nombre = document.createElement('td');
            nombre.textContent = cultivo.nombre;
            const acciones = document.createElement('td');

            [['editar', 'Editar', 'btn-edit'], ['eliminar', 'Eliminar', 'btn-danger']].forEach(([accion, texto, clase]) => {
                const boton = document.createElement('button');
                boton.type = 'button';
                boton.className = `btn ${clase} btn-accion`;
                boton.dataset.accion = accion;
                boton.dataset.id = cultivo.id;
                boton.textContent = texto;
                acciones.appendChild(boton);
            });

            fila.append(area, nombre, acciones);
            tbody.appendChild(fila);
        });
    } catch (error) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 3;
        celda.textContent = `No se pudieron cargar los cultivos: ${error.message}`;
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }
}

document.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('.btn-accion');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === 'eliminar') {
        if (!confirm('¿Está completamente seguro de eliminar esta área de cultivo del sistema?')) return;
        try {
            await API.eliminarDato(id);
            await cargarTabla();
            alert('Área eliminada exitosamente.');
        } catch (error) {
            alert(`No se pudo eliminar el área: ${error.message}`);
        }
        return;
    }

    const cultivo = cultivos.find((item) => item.id === id);
    if (cultivo) {
        document.getElementById('edit-id').value = cultivo.id;
        document.getElementById('edit-nombre').value = cultivo.nombre;
        document.getElementById('edit-riego').value = cultivo.riego;
        formCaja.classList.remove('oculto');
    }
});

document.getElementById('btn-guardar-edicion').addEventListener('click', async () => {
    const id = Number(document.getElementById('edit-id').value);
    const nombre = document.getElementById('edit-nombre').value.trim();
    const riego = Number(document.getElementById('edit-riego').value);
    if (!nombre || !Number.isInteger(riego) || riego < 1) {
        alert('Ingresa un nombre y un tiempo de riego válido.');
        return;
    }

    try {
        await API.actualizarDato(id, { nombre, riego });
        formCaja.classList.add('oculto');
        await cargarTabla();
        alert('Área modificada.');
    } catch (error) {
        alert(`No se pudo actualizar el área: ${error.message}`);
    }
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
    formCaja.classList.add('oculto');
});

cargarTabla();