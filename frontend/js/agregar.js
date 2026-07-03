const form = document.getElementById('form-agregar');
const inputNombre = document.getElementById('nombre');
const inputTemp = document.getElementById('temp');

inputNombre.addEventListener('input', () => {
    if (inputNombre.value.length < 3) {
        inputNombre.classList.add('error-input');
        document.getElementById('err-nombre').textContent = 'Mínimo 3 letras.';
    } else {
        inputNombre.classList.remove('error-input');
        document.getElementById('err-nombre').textContent = '';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let esValido = true;

    const n = inputNombre.value.trim();
    const conf = document.getElementById('nombre-conf').value.trim();
    const temp = inputTemp.value.trim();

    // Resetear estilos de error previos
    document.querySelectorAll('input').forEach(i => i.classList.remove('error-input'));
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');

    // Validar nombre largo
    if (n.length < 3) {
        inputNombre.classList.add('error-input');
        document.getElementById('err-nombre').textContent = 'Mínimo 3 letras.';
        esValido = false;
    }

    // Validar coincidencia
    if (n !== conf || !conf) {
        document.getElementById('nombre-conf').classList.add('error-input');
        document.getElementById('err-conf').textContent = 'Los nombres no coinciden.';
        esValido = false;
    }

    // Validación estricta de temperatura (Rango 0 - 50)
    const tempVal = parseFloat(temp);
    if (temp === '' || isNaN(tempVal) || tempVal < 0 || tempVal > 50) {
        inputTemp.classList.add('error-input'); // Feedback visual mediante clase CSS
        document.getElementById('err-temp').textContent = 'Debe ser un número válido entre 0 y 50°C.';
        esValido = false;
    }

    if (esValido) {
        API.guardarDato({
            id: Date.now(),
            nombre: n,
            temp: tempVal,
            humAire: parseFloat(document.getElementById('humAire').value) || 50,
            humSuelo: parseFloat(document.getElementById('humSuelo').value) || 50,
            riego: parseInt(document.getElementById('riego').value) || 6,
            tamano: parseFloat(document.getElementById('tamano').value) || 100,
            estado: 'Activa'
        });
        window.location.href = 'index.html';
    }
});