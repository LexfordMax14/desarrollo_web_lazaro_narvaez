let contadorActividades = document.querySelectorAll('.actividad-grupo').length;

const TIPOS_ACTIVIDAD = ['arte','deporte','tecnología','social','recreación','otra'];
const DIAS_SEMANA     = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

function agregarActividad() {
    const indice = contadorActividades;
    document.getElementById('contenedor-actividades')
        .insertAdjacentHTML('beforeend', crearHtmlActividad(indice));
    contadorActividades++;
    actualizarBotonesEliminar();
}

function eliminarActividad(indice) {
    document.querySelector('[data-actividad="' + indice + '"]').remove();
    actualizarBotonesEliminar();
}

function actualizarBotonesEliminar() {
    const botones = document.querySelectorAll('.btn-eliminar');
    const mostrar = botones.length > 1;
    botones.forEach(b => { b.style.display = mostrar ? 'block' : 'none'; });
}

function crearHtmlActividad(indice) {
    return `
        <div class="actividad-grupo" data-actividad="${indice}">
            <h2>Actividad ${indice + 1}</h2>

            <label for="nombre_actividad_${indice}">Nombre:</label>
            <input type="text" id="nombre_actividad_${indice}" name="nombre_actividad[]" required>
            <span class="error" id="error_nombre_actividad_${indice}"></span><br><br>

            <label for="descripcion_${indice}">Descripción:</label>
            <textarea id="descripcion_${indice}" name="descripcion[]" rows="4" cols="40"></textarea>
            <br><br>

            <label for="tipo_${indice}">Tipo:</label>
            <select id="tipo_${indice}" name="tipo[]" required>
                <option value="">Seleccione un tipo</option>
                ${crearOpciones(TIPOS_ACTIVIDAD)}
            </select>
            <span class="error" id="error_tipo_${indice}"></span><br><br>

            <label for="dia_${indice}">Día:</label>
            <select id="dia_${indice}" name="dia[]" required>
                <option value="">Seleccione un día</option>
                ${crearOpciones(DIAS_SEMANA)}
            </select>
            <span class="error" id="error_dia_${indice}"></span><br><br>

            <label for="hora_inicio_${indice}">Hora de inicio:</label>
            <input type="time" id="hora_inicio_${indice}" name="hora_inicio[]" required>
            <span class="error" id="error_hora_inicio_${indice}"></span><br><br>

            <label for="duracion_${indice}">Duración (HH:MM):</label>
            <input type="time" id="duracion_${indice}" name="duracion[]" required>
            <span class="error" id="error_duracion_${indice}"></span><br><br>

            <label for="archivo_${indice}">Archivo (opcional):</label>
            <input type="file" id="archivo_${indice}" name="archivo[]">
            <span class="error" id="error_archivo_${indice}"></span><br><br>

            <button type="button" class="btn-eliminar"
                    onclick="eliminarActividad(${indice})"
                    style="background-color:#d32f2f;">
                Eliminar esta actividad
            </button>
            <hr>
        </div>
    `;
}

function crearOpciones(opciones) {
    return opciones.map(op =>
        `<option value="${op}">${capitalizar(op)}</option>`
    ).join('');
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

actualizarBotonesEliminar();
