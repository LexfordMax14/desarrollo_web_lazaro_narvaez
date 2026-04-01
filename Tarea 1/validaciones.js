document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-registro");

    if (!formulario) {
        return;
    }

    //obtener campos del formulario par (nombre, elemeneto)
    const campos = {
        nombre: document.getElementById("nombre"),
        rol: document.getElementById("rol"),
        correo: document.getElementById("correo"),
        telefono: document.getElementById("telefono"),
        contrasena: document.getElementById("contrasena"),
        actividad_nombre: document.getElementById("actividad_nombre"),
        descripcion: document.getElementById("descripcion")
    };

    //Expreciones regulares para validación
    const correoRegex = /^[a-z]+@(gmail|hotmail|uchile|ug\.uchile)\.[a-z]{2,3}$/;
    const telefonoRegex = /^9\d{8}$/;
    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    //Función para mostrar u ocultar mensajes de error
    function mostrarError(nombreCampo, mostrar) {
        const error = document.getElementById(`error-${nombreCampo}`);

        if (!error) {
            return;
        }

        error.classList.toggle("visible", mostrar);
    }

    //Validacion de campos
    function validarNombre() {
        const esValido = campos.nombre.value.trim() !== "";
        mostrarError("nombre", !esValido);
        return esValido;
    }

    function validarRol() {
        const esValido = campos.rol.value.trim() !== "";
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

    //Asignar validadores a eventos
    const validadores = {
        nombre: validarNombre,
        rol: validarRol,
        correo: validarCorreo,
        telefono: validarTelefono,
        contrasena: validarContrasena,
        actividad_nombre: validarActividadNombre,
        descripcion: validarDescripcion
    };

    //funcion para asignar eventos a cada campo y validar cuando se escribe,cuando se sale del campo o cuando se cambia el valor
    Object.entries(campos).forEach(([nombreCampo, campo]) => {
        campo.addEventListener("blur", validadores[nombreCampo]);
        campo.addEventListener("input", validadores[nombreCampo]);
        campo.addEventListener("change", validadores[nombreCampo]);
    });

    formulario.addEventListener("submit", (event) => {
        const resultados = Object.values(validadores).map((validador) => validador());
        const formularioValido = resultados.every((resultado) => resultado);

        if (!formularioValido) {
            event.preventDefault();
        }
    });
});
