document.addEventListener('DOMContentLoaded', () => {
    cargarComunas();
    agregarActividad();

    document.getElementById('form-registro').addEventListener('submit', async (e) => {
        e.preventDefault();
        enviarRegistro();
    });
});

async function cargarComunas() {
    try {
        const resp = await fetch('/api/comunas');
        const comunas = await resp.json();
        const select = document.getElementById('comuna_id');
        select.innerHTML = '<option value="">Seleccione una comuna</option>';
        comunas.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.nombre;
            select.appendChild(opt);
        });
    } catch (e) {
        document.getElementById('comuna_id').innerHTML =
            '<option value="">Error al cargar comunas</option>';
    }
}

async function enviarRegistro() {
    const erroresDiv  = document.getElementById('errores-globales');
    const exitoDiv    = document.getElementById('mensaje-exito');
    const btn         = document.getElementById('btn-registrar');

    erroresDiv.style.display = 'none';
    exitoDiv.style.display   = 'none';

    if (!validarFormulario()) return;

    btn.disabled = true;
    const formData = new FormData(document.getElementById('form-registro'));

    try {
        const resp   = await fetch('/api/miembros', { method: 'POST', body: formData });
        const result = await resp.json();

        if (!result.success) {
            const ul = document.createElement('ul');
            (result.errores || ['Error al registrar.']).forEach(msg => {
                const li = document.createElement('li');
                li.textContent = msg;
                ul.appendChild(li);
            });
            erroresDiv.replaceChildren(ul);
            erroresDiv.style.display = 'block';
            return;
        }

        exitoDiv.textContent = result.mensaje || 'Registro exitoso.';
        exitoDiv.style.display = 'block';
        document.getElementById('form-registro').reset();
        document.getElementById('contenedor-actividades').innerHTML = '';
        agregarActividad();
        window.scrollTo(0, 0);
    } catch (err) {
        erroresDiv.innerHTML = '<ul><li>Error de conexión: ' + err.message + '</li></ul>';
        erroresDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
    }
}
