document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-registro");
    const STORAGE_KEY = "registrosActividades";

    if (!formulario) {
        return;
    }

    // obtener campos del formulario
    const campos = {
        nombre: document.getElementById("nombre"),
        rol: document.getElementById("rol"),
        correo: document.getElementById("correo"),
        telefono: document.getElementById("telefono"),
        contrasena: document.getElementById("contrasena"),
        actividad_nombre: document.getElementById("actividad_nombre"),
        descripcion: document.getElementById("descripcion"),
        categoria: document.getElementById("categoria"),
        hora_inicio: document.getElementById("hora_inicio"),
        hora_fin: document.getElementById("hora_fin"),
        archivo: document.getElementById("archivo"),
        link: document.getElementById("link")
    };
    const camposDias = document.querySelectorAll('input[name="dias"]');

    // expresiones regulares para validacion
    const correoRegex = /^[A-Za-z0-9._%+-]+@(gmail|hotmail|uchile|ug\.uchile)\.[a-z]{2,3}$/;
    const telefonoRegex = /^9\d{8}$/;
    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    // mostrar u ocultar mensajes de error
    function mostrarError(nombreCampo, mostrar) {
        const error = document.getElementById(`error-${nombreCampo}`);

        if (!error) {
            return;
        }

        error.classList.toggle("visible", mostrar);
    }

    // validacion de campos
    function validarNombre() {
        const esValido = campos.nombre.value.trim() !== "";
        mostrarError("nombre", !esValido);
        return esValido;
    }

    function validarRol() {
        const esValido = campos.rol.value !== "";
        mostrarError("rol", !esValido);
        return esValido;
    }

    function validarCorreo() {
        const valor = campos.correo.value.trim();
        const esValido = correoRegex.test(valor);
        mostrarError("correo", !esValido);
        return esValido;
    }

    function validarTelefono() {
        const valor = campos.telefono.value.trim();
        const esValido = telefonoRegex.test(valor);
        mostrarError("telefono", !esValido);
        return esValido;
    }

    function validarContrasena() {
        const valor = campos.contrasena.value;
        const esValido = contrasenaRegex.test(valor);
        mostrarError("contrasena", !esValido);
        return esValido;
    }

    function validarActividadNombre() {
        const esValido = campos.actividad_nombre.value.trim() !== "";
        mostrarError("actividad_nombre", !esValido);
        return esValido;
    }

    function validarDescripcion() {
        const esValido = campos.descripcion.value.trim() !== "";
        mostrarError("descripcion", !esValido);
        return esValido;
    }

    function validarCategoria() {
        const estaVacio = !campos.categoria.value;
        mostrarError("categoria", estaVacio);
        return !estaVacio;
    }

    function validarDias() {
        const estaVacio = !Array.from(camposDias).some((campoDia) => campoDia.checked);
        mostrarError("dias", estaVacio);
        return !estaVacio;
    }

    function validarHoraInicio() {
        const estaVacio = !campos.hora_inicio.value;
        mostrarError("hora_inicio", estaVacio);
        return !estaVacio;
    }

    function validarHoraFin() {
        const estaVacio = !campos.hora_fin.value;
        mostrarError("hora_fin", estaVacio);
        return !estaVacio;
    }

    function validarArchivo() {
        const estaVacio = !campos.archivo.files.length;
        mostrarError("archivo", estaVacio);
        return !estaVacio;
    }

    function validarLink() {
        const estaVacio = !campos.link.value.trim();
        mostrarError("link", estaVacio);
        return !estaVacio;
    }

    // obtener el texto visible de un select
    function obtenerTextoSeleccionado(select) {
        return select.options[select.selectedIndex]?.text ?? "";
    }

    // guardar los datos necesarios en localStorage para mostrarlos en el listado
    function guardarRegistro() {
        const registrosGuardados = localStorage.getItem(STORAGE_KEY);
        const registros = registrosGuardados ? JSON.parse(registrosGuardados) : [];

        const nuevoRegistro = {
            categoria: obtenerTextoSeleccionado(campos.categoria),
            nombre: campos.nombre.value.trim(),
            cargo: obtenerTextoSeleccionado(campos.rol),
            telefono: campos.telefono.value.trim(),
            correo: campos.correo.value.trim()
        };

        registros.push(nuevoRegistro);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros)); //convertir a texto
    }

    // asignar validadores a eventos
    const validadores = {
        nombre: validarNombre,
        rol: validarRol,
        correo: validarCorreo,
        telefono: validarTelefono,
        contrasena: validarContrasena,
        actividad_nombre: validarActividadNombre,
        descripcion: validarDescripcion,
        categoria: validarCategoria,
        hora_inicio: validarHoraInicio,
        hora_fin: validarHoraFin,
        archivo: validarArchivo,
        link: validarLink
    };

    // Validar cada campo cuando cambia o pierde el foco
    Object.entries(campos).forEach(([nombreCampo, campo]) => {
        campo.addEventListener("blur", validadores[nombreCampo]);
        campo.addEventListener("input", validadores[nombreCampo]);
        campo.addEventListener("change", validadores[nombreCampo]);
    });

    // Validar los dias por separado porque son varios checkboxes
    camposDias.forEach((campoDia) => {
        campoDia.addEventListener("change", validarDias);
    });

    // Validar todo el formulario antes de guardar y redirigir
    formulario.addEventListener("submit", (event) => {
        const resultados = [
            ...Object.values(validadores).map((validador) => validador()),
            validarDias()
        ];
        const formularioValido = resultados.every((resultado) => resultado);

        if (!formularioValido) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        guardarRegistro();
        window.location.href = "listado.html";
    });
});
