document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "registrosActividades"; //llave de localStorage
    const contenedor = document.getElementById("contenedor-listado"); //donde insertar la tabla o mensaje de no registros
    const filtroCargo = document.getElementById("filtro-cargo");

    if (!contenedor || !filtroCargo) {
        return;
    }

    //obtener registros guardados en localStorage
    const registrosGuardados = localStorage.getItem(STORAGE_KEY);
    const registros = registrosGuardados ? JSON.parse(registrosGuardados) : [];

    //en caso de no tener registros mostrar el mensaje correrpondiente
    if (registros.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "No hay registros disponibles.";
        contenedor.appendChild(mensajeVacio);
        return;
    }

    function renderizarTabla(registrosFiltrados) {
        contenedor.innerHTML = "";

        if (registrosFiltrados.length === 0) {
            const mensajeSinResultados = document.createElement("p");
            mensajeSinResultados.textContent = "No hay registros para el cargo seleccionado.";
            contenedor.appendChild(mensajeSinResultados);
            return;
        }

        //crear tabla
        const tabla = document.createElement("table");
        const encabezado = document.createElement("thead");
        const filaEncabezado = document.createElement("tr");
        const columnas = ["Categoria", "Nombre", "Cargo", "Datos de contacto"];
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
        registrosFiltrados.forEach((registro) => {
            const fila = document.createElement("tr");
            const datosContacto = `${registro.telefono} | ${registro.correo}`;
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

            //insertar fila en el cuerpo de la tabla
            cuerpo.appendChild(fila);
        });

        //insertar cuerpo en la tabla y luego la tabla en el contenedor
        tabla.appendChild(cuerpo);
        contenedor.appendChild(tabla);
    }

    //asignar evento al select para filtrar por cargo y crear html dinamicamente
    filtroCargo.addEventListener("change", () => {
        const cargoSeleccionado = filtroCargo.value;
        const registrosFiltrados = cargoSeleccionado === "todos"
            ? registros
            : registros.filter((registro) => registro.cargo === cargoSeleccionado);

        renderizarTabla(registrosFiltrados);
    });

    renderizarTabla(registros);
});
