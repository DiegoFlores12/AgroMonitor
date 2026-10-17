const USUARIOS_DEMO_KEY = 'agromonitor_usuarios_demo';
const SUPERADMIN_DEMO = {
    id: 'superadmin-eweawa',
    nombre: 'Superadmin',
    email: 'eweawa192@gmail.com',
    rol: 'superadmin',
    verificado: true
};

function obtenerUsuariosDemo() {
    try {
        const guardados = JSON.parse(localStorage.getItem(USUARIOS_DEMO_KEY) || 'null');
        if (Array.isArray(guardados)) return guardados;
    } catch {
        localStorage.removeItem(USUARIOS_DEMO_KEY);
    }

    const iniciales = [
        SUPERADMIN_DEMO,
        { id: 'usuario-demo', nombre: 'Usuario de prueba', email: 'usuario.demo@agromonitor.local', rol: 'usuario', verificado: true }
    ];
    localStorage.setItem(USUARIOS_DEMO_KEY, JSON.stringify(iniciales));
    return iniciales;
}

function guardarUsuariosDemo(usuarios) {
    localStorage.setItem(USUARIOS_DEMO_KEY, JSON.stringify(usuarios));
}

function crearCelda(texto) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
}

function renderizarUsuarios() {
    const filas = document.getElementById('tabla-usuarios');
    const mensaje = document.getElementById('usuarios-mensaje');
    const usuarios = obtenerUsuariosDemo().filter(usuario => usuario.verificado);
    filas.replaceChildren();
    document.getElementById('usuarios-total').textContent = String(usuarios.length);
    document.getElementById('usuarios-vacio').hidden = usuarios.length > 0;

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.append(crearCelda(usuario.nombre), crearCelda(usuario.email));

        const celdaRol = document.createElement('td');
        if (usuario.email.toLowerCase() === SUPERADMIN_DEMO.email) {
            celdaRol.textContent = 'Superadmin';
        } else {
            const selector = document.createElement('select');
            selector.setAttribute('aria-label', `Rol de ${usuario.email}`);
            [['usuario', 'Usuario'], ['administrador', 'Administrador']].forEach(([valor, etiqueta]) => {
                const opcion = document.createElement('option');
                opcion.value = valor;
                opcion.textContent = etiqueta;
                selector.append(opcion);
            });
            selector.value = usuario.rol;
            selector.addEventListener('change', () => {
                const actualizados = obtenerUsuariosDemo().map(cuenta => cuenta.id === usuario.id
                    ? { ...cuenta, rol: selector.value }
                    : cuenta);
                guardarUsuariosDemo(actualizados);
                mensaje.textContent = `Rol actualizado para ${usuario.email}.`;
            });
            celdaRol.append(selector);
        }
        fila.append(celdaRol, crearCelda('Verificado'));

        const celdaAcciones = document.createElement('td');
        if (usuario.email.toLowerCase() === SUPERADMIN_DEMO.email) {
            celdaAcciones.textContent = 'Cuenta protegida';
        } else {
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'btn btn-danger';
            botonEliminar.type = 'button';
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.setAttribute('aria-label', `Eliminar cuenta ${usuario.email}`);
            botonEliminar.addEventListener('click', () => {
                if (!window.confirm(`¿Eliminar la cuenta ${usuario.email} de los datos de muestra?`)) return;
                guardarUsuariosDemo(obtenerUsuariosDemo().filter(cuenta => cuenta.id !== usuario.id));
                mensaje.textContent = `Cuenta ${usuario.email} eliminada de este navegador.`;
                renderizarUsuarios();
            });
            celdaAcciones.append(botonEliminar);
        }
        fila.append(celdaAcciones);
        filas.append(fila);
    });
}

renderizarUsuarios();