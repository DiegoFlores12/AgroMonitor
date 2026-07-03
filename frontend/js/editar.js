const tbody = document.querySelector('#tabla-editar tbody');
const formCaja = document.getElementById('form-editar-caja');

function cargarTabla() {
    tbody.innerHTML = '';
    const cultivos = API.obtenerDatos();
    
    cultivos.forEach((c, index) => {
        const tr = document.createElement('tr');
        tr.id = `fila-cultivo-${c.id}`; // Asignamos ID único a la fila para rastrearla
        tr.innerHTML = `
            <td>Área ${index + 1}</td>
            <td>${c.nombre}</td>
            <td>
                <button class="btn btn-edit btn-accion" data-accion="editar" data-id="${c.id}">Editar</button>
                <button class="btn btn-danger btn-accion" data-accion="eliminar" data-id="${c.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-accion')) {
        const id = parseInt(e.target.dataset.id);
        const accion = e.target.dataset.accion;

        if (accion === 'eliminar') {
            // Confirmación obligatoria antes de eliminar
            if (confirm('¿Está completamente seguro de eliminar esta área de cultivo del sistema?')) {
                API.eliminarDato(id); // Borra del almacenamiento persistente
                
                // Remoción dinámica directa sobre el DOM sin recargar la página
                const filaElemento = document.getElementById(`fila-cultivo-${id}`);
                if (filaElemento) {
                    filaElemento.remove(); 
                }
                alert('Área eliminada exitosamente.');
            }
        } 
        else if (accion === 'editar') {
            const cultivo = API.obtenerDatos().find(c => c.id === id);
            document.getElementById('edit-id').value = cultivo.id;
            document.getElementById('edit-nombre').value = cultivo.nombre;
            document.getElementById('edit-riego').value = cultivo.riego;
            formCaja.classList.remove('oculto');
        }
    }
});

document.getElementById('btn-guardar-edicion').addEventListener('click', () => {
    const id = parseInt(document.getElementById('edit-id').value);
    const nombre = document.getElementById('edit-nombre').value;
    const riego = document.getElementById('edit-riego').value;

    API.actualizarDato(id, { nombre, riego: parseInt(riego) });
    formCaja.classList.add('oculto');
    cargarTabla();
    alert('Área modificada');
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
    formCaja.classList.add('oculto');
});

cargarTabla();