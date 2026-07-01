const campoBusqueda      = document.getElementById('campo-busqueda');
const contenedorResultados = document.getElementById('resultados-busqueda');
const dialogo            = document.getElementById('dialogo-nota');
const dialogoNombre      = document.getElementById('dialogo-nombre-actividad');
const selectNota         = document.getElementById('select-nota');
const errorNota          = document.getElementById('error-nota');
const btnConfirmar       = document.getElementById('btn-confirmar-nota');
const btnCancelar        = document.getElementById('btn-cancelar-nota');

let actividadSeleccionadaId   = null;
let actividadSeleccionadaNombre = null;
let filaNotaActual            = null;
let timeoutBusqueda           = null;

campoBusqueda.addEventListener('input', () => {
    clearTimeout(timeoutBusqueda);
    const q = campoBusqueda.value.trim();

    if (q.length < 3) {
        contenedorResultados.innerHTML = '';
        return;
    }

    timeoutBusqueda = setTimeout(() => buscar(q), 300);
});

async function buscar(q) {
    contenedorResultados.innerHTML = '<p>Buscando...</p>';
    try {
        const resp = await fetch('/api/buscar?q=' + encodeURIComponent(q));
        const json = await resp.json();

        if (!json.success || json.data.length === 0) {
            contenedorResultados.innerHTML =
                '<p>No se encontraron actividades que coincidan con la búsqueda.</p>';
            return;
        }

        renderizarResultados(json.data, q);
    } catch (e) {
        contenedorResultados.innerHTML = '<p>Error al realizar la búsqueda.</p>';
    }
}

function renderizarResultados(actividades, q) {
    const tabla = document.createElement('table');

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Miembro', 'Día', 'Tipo', 'Comuna', 'Nombre', 'Descripción', 'Nota', 'Evaluar']
        .forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            trHead.appendChild(th);
        });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    actividades.forEach(act => {
        const tr = document.createElement('tr');
        tr.dataset.actividadId = act.id;

        [act.miembroNombre, act.dia, act.tipo, act.comunaNombre,
         act.nombre, act.descripcion || ''].forEach(texto => {
            const td = document.createElement('td');
            td.innerHTML = destacarTexto(texto, q);
            tr.appendChild(td);
        });

        const tdNota = document.createElement('td');
        tdNota.className = 'celda-nota';
        tdNota.innerHTML = formatearNota(act.promedioNota, act.cantidadNotas);
        tr.appendChild(tdNota);

        const tdEvaluar = document.createElement('td');
        const btnEvaluar = document.createElement('button');
        btnEvaluar.type = 'button';
        btnEvaluar.textContent = 'Evaluar';
        btnEvaluar.addEventListener('click', () => abrirDialogo(act, tr));
        tdEvaluar.appendChild(btnEvaluar);
        tr.appendChild(tdEvaluar);

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    contenedorResultados.replaceChildren(tabla);
}

function formatearNota(promedio, cantidad) {
    if (promedio === null || promedio === undefined || cantidad === 0) {
        return '<span>-</span>';
    }
    return `<span title="${cantidad} evaluación(es)">${promedio.toFixed(1)}</span>`;
}

function destacarTexto(texto, q) {
    if (!texto) return '';
    const escaped = texto.replace(/[&<>"']/g, c =>
        ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(escapedQ, 'gi'),
        m => `<mark>${m}</mark>`);
}

function abrirDialogo(act, fila) {
    actividadSeleccionadaId     = act.id;
    actividadSeleccionadaNombre = act.nombre;
    filaNotaActual              = fila;

    dialogoNombre.textContent = 'Actividad: ' + act.nombre;
    selectNota.value = '';
    errorNota.style.display = 'none';
    errorNota.textContent = '';

    dialogo.showModal();
}

btnCancelar.addEventListener('click', () => dialogo.close());

btnConfirmar.addEventListener('click', async () => {
    const valor = selectNota.value;

    if (!valor) {
        mostrarErrorNota('Debe seleccionar una nota.');
        return;
    }

    const notaNum = parseInt(valor, 10);
    if (!Number.isInteger(notaNum) || notaNum < 1 || notaNum > 7) {
        mostrarErrorNota('La nota debe ser un entero entre 1 y 7.');
        return;
    }

    btnConfirmar.disabled = true;
    try {
        const resp = await fetch('/api/actividad/' + actividadSeleccionadaId + '/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota: notaNum }),
        });
        const json = await resp.json();

        if (!json.success) {
            mostrarErrorNota((json.errores || ['Error al guardar la nota.']).join(' '));
            return;
        }

        // Actualizar celda de nota y contador en la fila correspondiente
        const celdaNota = filaNotaActual.querySelector('.celda-nota');
        if (celdaNota) {
            celdaNota.innerHTML = formatearNota(json.promedioNota, json.cantidadNotas);
        }

        dialogo.close();
    } catch (e) {
        mostrarErrorNota('Error de conexión.');
    } finally {
        btnConfirmar.disabled = false;
    }
});

function mostrarErrorNota(msg) {
    errorNota.textContent = msg;
    errorNota.style.display = 'block';
}

dialogo.addEventListener('click', e => {
    if (e.target === dialogo) dialogo.close();
});
