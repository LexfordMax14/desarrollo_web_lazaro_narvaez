document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "registrosActividades"; //llave de localStorage
    const contenedor = document.getElementById("contenedor-listado");//donde insertar la tabla o mensaje de no registros

    if (!contenedor) {
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
    registros.forEach((registro) => {
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
});
