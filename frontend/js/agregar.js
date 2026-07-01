const form = document.getElementById('form-agregar');
const inputNombre = document.getElementById('nombre');

inputNombre.addEventListener('input', () => {
    document.getElementById('err-nombre').textContent = inputNombre.value.length < 3 ? 'Mínimo 3 letras.' : '';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let esValido = true;
    const campos = ['nombre', 'nombre-conf', 'temp', 'humAire', 'humSuelo', 'riego', 'tamano'];
    const valores = {};
    campos.forEach(id => {
        valores[id] = document.getElementById(id).value.trim();
        if (!valores[id]) esValido = false;
    });

    if (!esValido) { alert('Todos los campos son requeridos.'); return; }

    if (valores['nombre'].length < 3) esValido = false;
    if (valores['nombre'] !== valores['nombre-conf']) {
        document.getElementById('err-conf').textContent = 'Los nombres no coinciden';
        esValido = false;
    } else { document.getElementById('err-conf').textContent = ''; }

    const tempVal = parseFloat(valores['temp']);
    if (isNaN(tempVal) || tempVal < 0 || tempVal > 50) {
        document.getElementById('err-temp').textContent = 'Debe estar entre 0 y 50°C';
        esValido = false;
    } else { document.getElementById('err-temp').textContent = ''; }

    if (esValido) {
        API.guardarDato({
            id: Date.now(),
            nombre: valores['nombre'],
            temp: tempVal,
            humAire: parseFloat(valores['humAire']),
            humSuelo: parseFloat(valores['humSuelo']),
            riego: parseInt(valores['riego']),
            tamano: parseFloat(valores['tamano']),
            estado: 'Activa'
        });
        window.location.href = 'index.html';
    }
});