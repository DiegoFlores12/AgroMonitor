function formatearRut(valor) {
    const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 2) return limpio;

    const cuerpo = limpio.slice(0, -1).slice(0, 8);
    const verificador = limpio.slice(-1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${verificador}`;
}

function mostrarError(campo, mensaje) {
    const salida = document.querySelector(`[data-error-for="${campo.id}"]`);
    campo.classList.toggle('error-input', Boolean(mensaje));
    campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
    if (salida) salida.textContent = mensaje;
}

function guardarSesionAutenticada(usuario, datosExtra = {}) {
    const sesion = {
        autenticado: true,
        username: usuario,
        nombre_usuario: usuario,
        rol: 'administrador',
        ...datosExtra
    };
    sessionStorage.setItem('agromonitor_sesion', JSON.stringify(sesion));
    return sesion;
}

if (document.querySelector('[data-auth-form="login"]')) {
    const nombreSesion = sessionStorage.getItem('agromonitor_sesion');
    if (nombreSesion) {
        try {
            const sesion = JSON.parse(nombreSesion);
            if (sesion.autenticado) {
                window.location.replace('index.html');
            }
        } catch {
            sessionStorage.removeItem('agromonitor_sesion');
        }
    }
}

function mostrarErrorApiAutenticacion(formulario, status, body = {}) {
    const mensaje = formulario.querySelector('[data-auth-message]');
    if (!mensaje) return;

    if (body.code === 'ip_banned') {
        mensaje.textContent = 'El acceso desde esta conexión está temporalmente bloqueado.';
    } else if (body.code === 'auth_api_unavailable' || status === 503) {
        mensaje.textContent = 'El servicio de autenticación no está disponible. Inténtalo más tarde.';
    } else if (status === 409 && formulario.dataset.authForm === 'verificar-correo') {
        mensaje.textContent = body.error || 'Esta cuenta usa una app autenticadora; continúa con ese método.';
    } else {
        mensaje.textContent = body.error || 'No se pudo completar la solicitud.';
    }

    mensaje.hidden = false;
    mensaje.classList.remove('auth-message-info');
    mensaje.classList.add('auth-message-error');
}

window.mostrarErrorApiAutenticacion = mostrarErrorApiAutenticacion;

document.querySelectorAll('[data-rut]').forEach((campo) => {
    campo.addEventListener('blur', () => {
        campo.value = formatearRut(campo.value);
    });
});

document.querySelectorAll('[data-toggle-password]').forEach((boton) => {
    boton.addEventListener('click', () => {
        const campo = document.getElementById(boton.dataset.togglePassword);
        const mostrar = campo.type === 'password';
        campo.type = mostrar ? 'text' : 'password';
        boton.textContent = mostrar ? 'Ocultar' : 'Mostrar';
        boton.setAttribute('aria-label', `${mostrar ? 'Ocultar' : 'Mostrar'} contraseña`);
    });
});

document.querySelectorAll('[data-auth-form]').forEach((formulario) => {
    formulario.querySelectorAll('input').forEach((campo) => {
        campo.addEventListener('input', () => mostrarError(campo, ''));
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        let valido = true;
        const campos = Array.from(formulario.querySelectorAll('input'));

        campos.forEach((campo) => mostrarError(campo, ''));

        campos.forEach((campo) => {
            const valor = campo.value.trim();
            let error = '';

            if (campo.required && !valor) {
                error = 'Este campo es obligatorio.';
            } else if (campo.type === 'email' && valor && !campo.validity.valid) {
                error = 'Ingresa un correo válido.';
            } else if (campo.pattern && valor && !new RegExp(`^(?:${campo.pattern})$`).test(valor)) {
                error = 'Ingresa solo números.';
            }

            if (campo.id === 'usuario' && valor.length > 0 && (valor.length < 8 || valor.length > 32)) {
                error = 'El usuario debe tener entre 8 y 32 caracteres.';
            }

            if (campo.id === 'clave' && campo.value.length > 0 && campo.value.length < 8) {
                error = 'La contraseña debe tener al menos 8 caracteres.';
            }

            if (error) {
                mostrarError(campo, error);
                valido = false;
            }
        });

        const tipo = formulario.dataset.authForm;
        if (tipo === 'registro') {
            const correo = formulario.elements.email;
            const confirmarCorreo = formulario.elements.email_confirm;
            const clave = formulario.elements.password;
            const confirmarClave = formulario.elements.password_confirm;

            if (correo.value.trim().toLowerCase() !== confirmarCorreo.value.trim().toLowerCase()) {
                mostrarError(confirmarCorreo, 'Los correos no coinciden.');
                valido = false;
            }
            if (clave.value !== confirmarClave.value) {
                mostrarError(confirmarClave, 'Las contraseñas no coinciden.');
                valido = false;
            }
        }

        if (tipo === 'factor-inicial' && !formulario.querySelector('input[name="method"]:checked')) {
            valido = false;
        }

        const mensaje = formulario.querySelector('[data-auth-message]');
        if (!mensaje) return;

        if (!valido) {
            mensaje.hidden = true;
            return;
        }

        const mensajes = {
            login: 'Campos válidos. El inicio de sesión aún no está conectado a la API.',
            registro: 'Datos válidos. El registro y el correo de confirmación aún no están conectados a la API.',
            'verificar-correo': 'Formato válido. La verificación del código requiere conexión con la API.',
            'segundo-factor': 'Formato válido. La verificación del segundo factor requiere conexión con la API.',
            'totp-setup': 'Formato válido. La configuración TOTP requiere respuesta de la API.',
            'factor-inicial': 'Selección válida. La asociación del método requiere conexión con la API.',
            recuperar: 'Correo válido. La recuperación aún no está conectada a la API.'
        };

        mensaje.textContent = mensajes[tipo] || 'Formulario válido.';
        mensaje.hidden = false;
        mensaje.classList.add('auth-message-info');

        if (tipo === 'login') {
            const identificador = formulario.elements.identifier?.value?.trim() || 'admin';
            guardarSesionAutenticada(identificador || 'admin', { ultimo_login: new Date().toISOString() });
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 250);
        }
    });
});

document.querySelectorAll('[data-resend-code]').forEach((boton) => {
    boton.addEventListener('click', () => {
        const formulario = boton.closest('form');
        const mensaje = formulario.querySelector('[data-auth-message]');
        mensaje.textContent = 'El reenvío de códigos se activará al conectar la API.';
        mensaje.hidden = false;
        mensaje.classList.add('auth-message-info');
    });
});