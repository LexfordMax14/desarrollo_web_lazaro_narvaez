const contenedorDetalle = document.getElementById('contenedor-detalle');

const NOMBRE_MIN = 3;
const NOMBRE_MAX = 80;
const TEXTO_MIN  = 5;

async function cargarDetalle() {
    try {
        if (!miembro_id) {
            contenedorDetalle.innerHTML = '<p>Error: No se especificó un miembro.</p>';
            return;
        }

        const response = await fetch('/api/miembro/' + miembro_id);
        const result = await response.json();

        if (!result.success) {
            contenedorDetalle.innerHTML = '<p>No se encontró el registro solicitado.</p>';
            return;
        }

        const miembro = result.data;
        contenedorDetalle.replaceChildren(crearInfoMiembro(miembro));

        if (miembro.actividades && miembro.actividades.length > 0) {
            const titulo = document.createElement('h2');
            titulo.textContent = 'Actividades';
            contenedorDetalle.appendChild(titulo);

            miembro.actividades.forEach((actividad, index) => {
                contenedorDetalle.appendChild(crearArticuloActividad(actividad, index));
            });
        }
    } catch (error) {
        contenedorDetalle.innerHTML = '<p>Error al cargar el detalle: ' + error.message + '</p>';
    }
}

function crearInfoMiembro(miembro) {
    const lista = document.createElement('dl');
    lista.className = 'detalle-lista';

    const detalles = [
        { etiqueta: 'Nombre',          valor: miembro.nombre },
        { etiqueta: 'Email',           valor: miembro.email },
        { etiqueta: 'Teléfono',        valor: miembro.telefono },
        { etiqueta: 'Comuna',          valor: miembro.comuna ? miembro.comuna.nombre : 'N/A' },
        { etiqueta: 'Fecha Registro',  valor: new Date(miembro.fecha_registro).toLocaleDateString('es-ES') },
    ];

    detalles.forEach(detalle => {
        const termino = document.createElement('dt');
        termino.textContent = detalle.etiqueta;
        const descripcion = document.createElement('dd');
        descripcion.textContent = detalle.valor;
        lista.appendChild(termino);
        lista.appendChild(descripcion);
    });

    return lista;
}

function crearArticuloActividad(actividad, index) {
    const articulo = document.createElement('article');
    articulo.className = 'actividad';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Actividad ' + (index + 1) + ': ' + actividad.nombre;
    articulo.appendChild(titulo);

    const datos = [
        { etiqueta: 'Tipo',        valor: actividad.tipo },
        { etiqueta: 'Día',         valor: actividad.dia },
        { etiqueta: 'Hora Inicio', valor: actividad.hora_inicio },
        { etiqueta: 'Duración',    valor: actividad.duracion },
        { etiqueta: 'Descripción', valor: actividad.descripcion || 'Sin descripción' },
    ];

    datos.forEach(dato => {
        const parrafo = document.createElement('p');
        const etiqueta = document.createElement('strong');
        etiqueta.textContent = dato.etiqueta + ': ';
        parrafo.appendChild(etiqueta);
        parrafo.appendChild(document.createTextNode(dato.valor));
        articulo.appendChild(parrafo);
    });

    if (actividad.fotos && actividad.fotos.length > 0) {
        actividad.fotos.forEach(foto => {
            const parrafo = document.createElement('p');
            const enlace = document.createElement('a');
            enlace.href = '/' + foto.ruta_archivo;
            enlace.target = '_blank';
            enlace.textContent = foto.nombre_archivo;
            parrafo.appendChild(enlace);
            articulo.appendChild(parrafo);
        });
    }

    const tituloComentarios = document.createElement('h4');
    tituloComentarios.textContent = 'Comentarios';
    articulo.appendChild(tituloComentarios);

    const listaComentarios = document.createElement('ul');
    listaComentarios.className = 'lista-comentarios';
    articulo.appendChild(listaComentarios);

    articulo.appendChild(crearFormularioComentario(actividad.id, listaComentarios));
    cargarComentarios(actividad.id, listaComentarios);

    return articulo;
}

async function cargarComentarios(actividadId, lista) {
    try {
        const response = await fetch('/api/actividad/' + actividadId + '/comentarios');
        const result = await response.json();

        lista.replaceChildren();

        if (!result.success || result.data.length === 0) {
            const vacio = document.createElement('li');
            vacio.textContent = 'Aún no hay comentarios.';
            lista.appendChild(vacio);
            return;
        }

        result.data.forEach(comentario => {
            lista.appendChild(crearItemComentario(comentario));
        });
    } catch (error) {
        lista.replaceChildren();
        const item = document.createElement('li');
        item.textContent = 'Error al cargar comentarios: ' + error.message;
        lista.appendChild(item);
    }
}

function crearItemComentario(comentario) {
    const item = document.createElement('li');
    item.className = 'comentario';

    const cabecera = document.createElement('p');
    cabecera.className = 'comentario-cabecera';
    const fecha = new Date(comentario.fecha).toLocaleString('es-ES');
    const autor = document.createElement('strong');
    autor.textContent = comentario.nombre;
    cabecera.appendChild(autor);
    cabecera.appendChild(document.createTextNode(' — ' + fecha));

    const texto = document.createElement('p');
    texto.textContent = comentario.texto;

    item.appendChild(cabecera);
    item.appendChild(texto);
    return item;
}

function crearFormularioComentario(actividadId, listaComentarios) {
    const form = document.createElement('form');
    form.className = 'form-comentario';

    const labelNombre = document.createElement('label');
    labelNombre.textContent = 'Nombre:';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.required = true;
    inputNombre.minLength = NOMBRE_MIN;
    inputNombre.maxLength = NOMBRE_MAX;
    labelNombre.appendChild(inputNombre);

    const labelTexto = document.createElement('label');
    labelTexto.textContent = 'Comentario:';
    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.cols = 50;
    textarea.required = true;
    labelTexto.appendChild(textarea);

    const errores = document.createElement('div');
    errores.className = 'errores-comentario';

    const boton = document.createElement('button');
    boton.type = 'submit';
    boton.textContent = 'Agregar comentario';

    form.appendChild(labelNombre);
    form.appendChild(labelTexto);
    form.appendChild(errores);
    form.appendChild(boton);

    form.addEventListener('submit', evento => {
        evento.preventDefault();
        enviarComentario(actividadId, inputNombre, textarea, errores, listaComentarios, boton);
    });

    return form;
}

function validarComentarioCliente(nombre, texto) {
    const errores = [];
    if (nombre.length < NOMBRE_MIN || nombre.length > NOMBRE_MAX)
        errores.push('El nombre debe tener entre ' + NOMBRE_MIN + ' y ' + NOMBRE_MAX + ' caracteres.');
    if (texto.length < TEXTO_MIN)
        errores.push('El comentario debe tener al menos ' + TEXTO_MIN + ' caracteres.');
    return errores;
}

function mostrarErrores(contenedor, mensajes) {
    contenedor.replaceChildren();
    if (mensajes.length === 0) return;
    const ul = document.createElement('ul');
    mensajes.forEach(mensaje => {
        const li = document.createElement('li');
        li.textContent = mensaje;
        ul.appendChild(li);
    });
    contenedor.appendChild(ul);
}

async function enviarComentario(actividadId, inputNombre, textarea, errores, listaComentarios, boton) {
    const nombre = inputNombre.value.trim();
    const texto  = textarea.value.trim();

    const erroresCliente = validarComentarioCliente(nombre, texto);
    if (erroresCliente.length > 0) {
        mostrarErrores(errores, erroresCliente);
        return;
    }

    boton.disabled = true;
    try {
        const response = await fetch('/api/actividad/' + actividadId + '/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, texto }),
        });
        const result = await response.json();

        if (!result.success) {
            mostrarErrores(errores, result.errores || ['No se pudo guardar el comentario.']);
            return;
        }

        mostrarErrores(errores, []);
        inputNombre.value = '';
        textarea.value = '';
        cargarComentarios(actividadId, listaComentarios);
    } catch (error) {
        mostrarErrores(errores, ['Error de conexión: ' + error.message]);
    } finally {
        boton.disabled = false;
    }
}

cargarDetalle();
