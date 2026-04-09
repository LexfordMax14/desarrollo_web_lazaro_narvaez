const STORAGE_KEY = "registrosActividades"; //llave de localStorage
const filas_por_pagina = 10;
const contenedor = document.getElementById("contenedor-listado"); //donde insertar la tabla o mensaje de no registros
const filtroCargo = document.getElementById("filtro-cargo");
const ordenListado = document.getElementById("orden-listado");
let paginaActual = 1;

//obtener registros guardados en localStorage
const registrosGuardados = localStorage.getItem(STORAGE_KEY);
const registros = registrosGuardados ? JSON.parse(registrosGuardados) : [];

function renderizarTabla(registrosFiltrados) {
    contenedor.innerHTML = "";

    if (registrosFiltrados.length === 0) {
        const mensajeSinResultados = document.createElement("p");
        mensajeSinResultados.textContent = "No hay registros para el filtro seleccionado.";
        contenedor.appendChild(mensajeSinResultados);
        return;
    }

    const totalPaginas = Math.ceil(registrosFiltrados.length / filas_por_pagina);
    const inicio = (paginaActual - 1) * filas_por_pagina;
    const registrosPagina = registrosFiltrados.slice(inicio, inicio + filas_por_pagina);

    //crear tabla
    const tabla = document.createElement("table");
    const encabezado = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    const columnas = ["Categoria", "Nombre", "Cargo", "Datos de contacto", "Detalle"];
    const cuerpo = document.createElement("tbody");

    //primera fila con encabezados
    columnas.forEach((columna) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = columna;
        filaEncabezado.appendChild(th);
    });

    //inserta datos de encabezado en el encabezado de la tabla y luego el encabezado en la tabla
    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    //insertar datos de cada registro en la tabla
    registrosPagina.forEach((registro) => {
        const fila = document.createElement("tr");
        const datosContacto = `${registro.telefono} | ${registro.correo}`;
        const indiceRegistro = registros.indexOf(registro);
        const valores = [
            registro.categoria,
            registro.nombre,
            registro.cargo,
            datosContacto
        ];

        valores.forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaDetalle = document.createElement("td");
        const enlaceDetalle = document.createElement("a");
        enlaceDetalle.href = `detalle.html?indice=${indiceRegistro}`;
        enlaceDetalle.textContent = "Ver detalle";
        celdaDetalle.appendChild(enlaceDetalle);
        fila.appendChild(celdaDetalle);

        //insertar fila en el cuerpo de la tabla
        cuerpo.appendChild(fila);
    });

    //insertar cuerpo en la tabla y luego la tabla en el contenedor
    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);

    const paginacion = document.createElement("div");
    paginacion.className = "paginacion-listado";

    const izquierda = document.createElement("button");
    izquierda.type = "button";
    izquierda.textContent = "<";
    izquierda.disabled = paginaActual === 1;
    izquierda.addEventListener("click", () => {
        paginaActual -= 1;
        actualizarListado();
    });

    const pagina = document.createElement("span");
    pagina.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;

    const derecha = document.createElement("button");
    derecha.type = "button";
    derecha.textContent = ">";
    derecha.disabled = paginaActual === totalPaginas;
    derecha.addEventListener("click", () => {
        paginaActual += 1;
        actualizarListado();
    });

    paginacion.appendChild(izquierda);
    paginacion.appendChild(pagina);
    paginacion.appendChild(derecha);
    contenedor.appendChild(paginacion);
}

//funcion para obtener registros segun el filtro y orden
function obtenerRegistrosVisibles() {
    const cargoSeleccionado = filtroCargo.value;
    const [campoOrden, direccionOrden] = ordenListado.value.split("-");
    const registrosFiltrados = cargoSeleccionado === "todos" ? [...registros] : registros.filter((registro) => registro.cargo === cargoSeleccionado);
    registrosFiltrados.sort((registroA, registroB) => {
        const comparacion = registroA[campoOrden].localeCompare(registroB[campoOrden], "es", { sensitivity: "base" });
        return direccionOrden === "desc" ? -comparacion : comparacion;
    });

    return registrosFiltrados;
}

function actualizarListado() {
    renderizarTabla(obtenerRegistrosVisibles());
}

if (registros.length === 0) {
    const mensajeVacio = document.createElement("p");
    mensajeVacio.textContent = "No hay registros disponibles.";
    contenedor.appendChild(mensajeVacio);
} 

else {
    //asignar eventos para filtrar y ordenar el listado dinamicamente
    filtroCargo.addEventListener("change", () => {
        paginaActual = 1;
        actualizarListado();
    });
    ordenListado.addEventListener("change", () => {
        paginaActual = 1;
        actualizarListado();
    });

    actualizarListado();
}
