async function cargarLog() {
    const cuerpo = document.getElementById('cuerpo-log');
    const estado = document.getElementById('mensaje-estado');
    cuerpo.textContent = '';
    try {
        const resp = await fetch('/api/mensajes-log/lista');
        if (!resp.ok) throw new Error('No se pudo cargar el log');
        const filas = await resp.json();

        if (filas.length === 0) {
            estado.textContent = 'No hay mensajes registrados.';
            return;
        }
        estado.textContent = '';

        filas.forEach(fila => {
            const tr = document.createElement('tr');
            tr.appendChild(crearCelda(fila.id));
            tr.appendChild(crearCelda(formatearFecha(fila.fecha)));
            tr.appendChild(crearCelda(fila.mensaje));
            cuerpo.appendChild(tr);
        });
    } catch (error) {
        estado.textContent = 'Error: ' + error.message;
    }
}

function crearCelda(valor) {
    const td = document.createElement('td');
    td.textContent = valor != null ? valor : '';
    return td;
}

function formatearFecha(iso) {
    if (!iso) return '';
    return iso.replace('T', ' ').substring(0, 19);
}

cargarLog();
