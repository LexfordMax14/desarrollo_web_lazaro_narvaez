function validarFormulario() {
    limpiarErrores();

    const miembroValido = validarDatosMiembro();
    const actividadesValidas = validarTodasLasActividades();

    return miembroValido && actividadesValidas;
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach((elemento) => {
        elemento.textContent = '';
        elemento.style.display = 'none';
    });
}

function validarDatosMiembro() {
    let esValido = true;

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const comuna = document.getElementById('comuna_id').value;

    if (nombre.length < 2) {
        mostrarError('error_nombre', 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarError('error_email', 'Email invalido');
        esValido = false;
    }

    if (!/^9\d{8}$/.test(telefono)) {
        mostrarError('error_telefono', 'Telefono invalido (debe ser 9XXXXXXXX)');
        esValido = false;
    }

    if (!comuna) {
        mostrarError('error_comuna_id', 'Debe seleccionar una comuna');
        esValido = false;
    }

    return esValido;
}

function validarTodasLasActividades() {
    let esValido = true;

    document.querySelectorAll('.actividad-grupo').forEach((grupo) => {
        if (!validarActividad(grupo)) {
            esValido = false;
        }
    });

    return esValido;
}

function validarActividad(grupo) {
    let esValido = true;
    const indice = grupo.dataset.actividad;

    const nombre = obtenerValor(`nombre_actividad_${indice}`);
    const tipo = obtenerValor(`tipo_${indice}`);
    const dia = obtenerValor(`dia_${indice}`);
    const horaInicio = obtenerValor(`hora_inicio_${indice}`);
    const duracion = obtenerValor(`duracion_${indice}`);
    const archivo = document.getElementById(`archivo_${indice}`).files[0];

    if (nombre.length < 2) {
        mostrarError(`error_nombre_actividad_${indice}`, 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    }

    if (!tipo) {
        mostrarError(`error_tipo_${indice}`, 'Debe seleccionar un tipo');
        esValido = false;
    }

    if (!dia) {
        mostrarError(`error_dia_${indice}`, 'Debe seleccionar un dia');
        esValido = false;
    }

    if (!horaInicio) {
        mostrarError(`error_hora_inicio_${indice}`, 'Debe ingresar la hora de inicio');
        esValido = false;
    }

    if (!duracion) {
        mostrarError(`error_duracion_${indice}`, 'Debe ingresar la duracion');
        esValido = false;
    }

    if (archivo && !/\.(jpg|jpeg|png)$/i.test(archivo.name)) {
        mostrarError(`error_archivo_${indice}`, 'Extension no permitida (jpg, jpeg, png)');
        esValido = false;
    }

    return esValido;
}

function obtenerValor(elementId) {
    return document.getElementById(elementId).value.trim();
}

function mostrarError(elementId, mensaje) {
    const elemento = document.getElementById(elementId);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
}
