let fotoSeleccionada = null;

async function cargarFotos() {
    const galeria = document.getElementById('galeria');
    const estado = document.getElementById('mensaje-estado');
    galeria.textContent = '';
    try {
        const resp = await fetch('/api/admin-fotos/lista');
        if (!resp.ok) throw new Error('No se pudo cargar la galería');
        const fotos = await resp.json();

        if (fotos.length === 0) {
            estado.textContent = 'No hay fotos vigentes para mostrar.';
            return;
        }
        estado.textContent = '';

        fotos.forEach(foto => {
            const card = document.createElement('article');
            card.className = 'foto-card';

            const img = document.createElement('img');
            img.src = '/' + foto.rutaArchivo;
            img.alt = foto.nombreArchivo;
            card.appendChild(img);

            const info = document.createElement('div');
            info.className = 'foto-info';
            info.appendChild(crearLinea('Fecha registro', formatearFecha(foto.fechaRegistro)));
            info.appendChild(crearLinea('Comuna', foto.comuna));
            info.appendChild(crearLinea('Email', foto.email));
            card.appendChild(info);

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.textContent = 'Marcar como eliminada';
            boton.addEventListener('click', () => abrirModal(foto.id));
            card.appendChild(boton);

            galeria.appendChild(card);
        });
    } catch (error) {
        estado.textContent = 'Error: ' + error.message;
    }
}

function crearLinea(etiqueta, valor) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = etiqueta + ': ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(valor != null ? valor : ''));
    return p;
}

function formatearFecha(iso) {
    if (!iso) return '';
    return iso.replace('T', ' ').substring(0, 19);
}

function abrirModal(id) {
    fotoSeleccionada = id;
    document.getElementById('motivo-texto').value = '';
    document.getElementById('motivo-error').textContent = '';
    document.getElementById('modal-motivo').hidden = false;
}

function cerrarModal() {
    fotoSeleccionada = null;
    document.getElementById('modal-motivo').hidden = true;
}

async function confirmarEliminacion() {
    const motivo = document.getElementById('motivo-texto').value.trim();
    const error = document.getElementById('motivo-error');

    if (motivo.length < 5 || motivo.length > 200) {
        error.textContent = 'El motivo debe tener entre 5 y 200 caracteres.';
        return;
    }

    try {
        const resp = await fetch('/api/admin-fotos/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: fotoSeleccionada, motivo: motivo })
        });
        if (!resp.ok) {
            const data = await resp.json().catch(() => ({}));
            throw new Error(data.error || 'No se pudo eliminar la foto');
        }
        cerrarModal();
        cargarFotos();
    } catch (e) {
        error.textContent = 'Error: ' + e.message;
    }
}

document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
document.getElementById('btn-confirmar').addEventListener('click', confirmarEliminacion);

cargarFotos();
