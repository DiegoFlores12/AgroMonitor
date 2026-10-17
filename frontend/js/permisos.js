const SESSION_KEY = 'agromonitor_sesion';
const LOGIN_OBLIGATORIO = true;
const SUPERADMIN_EMAIL = 'eweawa192@gmail.com';

function obtenerSesionLocal() {
    try {
        return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
    } catch {
        return {};
    }
}

function guardarSesionLocal(datos = {}) {
    const sesionActual = obtenerSesionLocal();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        ...sesionActual,
        ...datos,
        autenticado: true,
        timestamp: Date.now()
    }));
}

function cerrarSesionLocal() {
    sessionStorage.removeItem(SESSION_KEY);
}

function esPaginaPublica() {
    const ruta = window.location.pathname.split('/').pop() || 'index.html';
    return /^(login|registro|recuperar-clave|verificar-correo|segundo-factor|elegir-segundo-factor|configurar-totp|verificar-correo|segundo-factor|recuperar-clave)\.html$/i.test(ruta);
}

if (LOGIN_OBLIGATORIO && !esPaginaPublica() && !obtenerSesionLocal().autenticado) {
    window.location.replace('login.html');
}

const Permisos = {
    obtenerRol: () => obtenerSesionLocal().rol || 'administrador',
    obtenerNombre: () => obtenerSesionLocal().username || obtenerSesionLocal().nombre_usuario || 'Admin de prueba',
    esSuperadmin: () => {
        const sesion = obtenerSesionLocal();
        return sesion.rol === 'superadmin' && (sesion.email || sesion.username || '').toLowerCase() === SUPERADMIN_EMAIL;
    },
    esAdministrador: () => Permisos.obtenerRol() === 'administrador' || Permisos.esSuperadmin(),
    iniciarSesion: (usuario, datosExtra = {}) => {
        guardarSesionLocal({
            username: usuario,
            nombre_usuario: usuario,
            rol: 'administrador',
            ...datosExtra
        });
    },
    cerrarSesion: () => {
        cerrarSesionLocal();
        window.location.href = 'login.html';
    },
    zonasVisibles: (zonas) => Permisos.esAdministrador()
        ? zonas
        : zonas.filter(zona => zona.estado !== 'Deshabilitada')
};

document.querySelectorAll('nav a[href="agregar.html"], nav a[href="editar.html"], nav a[href="configuracion.html"]').forEach(enlace => {
    enlace.hidden = !Permisos.esAdministrador();
});
document.querySelectorAll('[data-superadmin-only]').forEach(enlace => {
    enlace.hidden = !Permisos.esSuperadmin();
});

const nombreUsuario = document.getElementById('usuario-actual');
if (nombreUsuario) {
    const nombre = Permisos.obtenerNombre();
    nombreUsuario.textContent = nombre;
    document.getElementById('usuario-inicial').textContent = nombre.charAt(0).toUpperCase() || 'U';
    const nombreMenu = document.getElementById('usuario-menu-nombre');
    if (nombreMenu) nombreMenu.textContent = nombre;
}

const menuCuenta = document.querySelector('[data-menu-cuenta]');
if (menuCuenta) {
    const botonMenu = document.getElementById('boton-menu-cuenta');
    const desplegable = document.getElementById('menu-cuenta');
    const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

    function cerrarMenuCuenta() {
        desplegable.hidden = true;
        botonMenu.setAttribute('aria-expanded', 'false');
    }

    botonMenu.addEventListener('click', () => {
        desplegable.hidden = !desplegable.hidden;
        botonMenu.setAttribute('aria-expanded', String(!desplegable.hidden));
    });

    document.addEventListener('click', (evento) => {
        if (!menuCuenta.contains(evento.target)) cerrarMenuCuenta();
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            cerrarMenuCuenta();
            botonMenu.focus();
        }
    });

    botonCerrarSesion.addEventListener('click', () => {
        cerrarSesionLocal();
        window.location.href = 'login.html';
    });
}

if (document.body.dataset.soloAdmin === 'true' && !Permisos.esAdministrador()) {
    window.location.replace('index.html');
}

if (document.body.dataset.soloSuperadmin === 'true' && !Permisos.esSuperadmin()) {
    window.location.replace('index.html');
}