const relojDigital = document.getElementById('reloj-digital');
const fechaDigital = document.getElementById('fecha-digital');
const formatoHora = new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
});
const formatoFecha = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

function actualizarReloj() {
    const ahora = new Date();
    relojDigital.textContent = formatoHora.format(ahora);
    relojDigital.dateTime = ahora.toISOString();
    if (fechaDigital) {
        fechaDigital.textContent = formatoFecha.format(ahora);
        fechaDigital.dateTime = ahora.toISOString();
    }
}

actualizarReloj();
setInterval(actualizarReloj, 1000);

const punteroDisponible = window.matchMedia('(pointer: fine)').matches;
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (punteroDisponible && !movimientoReducido) {
    const raiz = document.documentElement;
    const cuerpo = document.body;
    window.addEventListener('pointermove', (evento) => {
        raiz.style.setProperty('--puntero-x', `${evento.clientX}px`);
        raiz.style.setProperty('--puntero-y', `${evento.clientY}px`);
        cuerpo.style.setProperty('--puntero-opacidad', '1');
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
        cuerpo.style.setProperty('--puntero-opacidad', '0');
    });

    const tarjetas = document.querySelectorAll('.card');
    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener('pointermove', (evento) => {
            const rect = tarjeta.getBoundingClientRect();
            const x = ((evento.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((evento.clientY - rect.top) / rect.height - 0.5) * -10;

            tarjeta.style.setProperty('--tilt-x', `${x}deg`);
            tarjeta.style.setProperty('--tilt-y', `${y}deg`);
        });

        tarjeta.addEventListener('pointerleave', () => {
            tarjeta.style.setProperty('--tilt-x', '0deg');
            tarjeta.style.setProperty('--tilt-y', '0deg');
        });
    });
}