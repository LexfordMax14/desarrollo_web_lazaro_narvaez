const filasPorPagina = 10;
const contenedor = document.getElementById("contenedor-listado");
let paginaActual = 1;

async function cargarMiembros() {
    try {
        const response = await fetch(`/api/miembros?page=${paginaActual}&limit=${filasPorPagina}`);
        const result = await response.json();

        if (!result.success) {
            contenedor.innerHTML = "<p>Error al cargar los miembros.</p>";
            return;
        }

        renderizarTabla(result.data, result.total);
    } catch (error) {
        contenedor.innerHTML = `<p>Error de conexion: ${error.message}</p>`;
    }
}

function renderizarTabla(miembros, totalMiembros) {
    contenedor.innerHTML = "";

    if (miembros.length === 0) {
        contenedor.innerHTML = "<p>No hay miembros registrados.</p>";
        return;
    }

    const tabla = document.createElement("table");
    const encabezado = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    const columnas = ["Nombre", "Email", "Telefono", "Fecha Registro"];
    const cuerpo = document.createElement("tbody");

    columnas.forEach((columna) => {
        const th = document.createElement("th");
        th.textContent = columna;
        filaEncabezado.appendChild(th);
    });

    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    miembros.forEach((miembro) => {
        const fila = document.createElement("tr");
        fila.style.cursor = "pointer";
        fila.addEventListener("click", () => {
            window.location.href = `/detalle/${miembro.id}`;
        });

        const fecha = new Date(miembro.fecha_registro);
        const valores = [
            miembro.nombre,
            miembro.email,
            miembro.telefono,
            fecha.toLocaleDateString("es-ES") + " " + fecha.toLocaleTimeString("es-ES"),
        ];

        valores.forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        cuerpo.appendChild(fila);
    });

    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);

    const totalPaginas = Math.ceil(totalMiembros / filasPorPagina);
    const paginacion = document.createElement("div");

    const anterior = document.createElement("button");
    anterior.type = "button";
    anterior.textContent = "<";
    anterior.disabled = paginaActual === 1;
    anterior.addEventListener("click", () => {
        paginaActual -= 1;
        cargarMiembros();
    });

    const pagina = document.createElement("span");
    pagina.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;

    const siguiente = document.createElement("button");
    siguiente.type = "button";
    siguiente.textContent = ">";
    siguiente.disabled = paginaActual === totalPaginas;
    siguiente.addEventListener("click", () => {
        paginaActual += 1;
        cargarMiembros();
    });

    paginacion.appendChild(anterior);
    paginacion.appendChild(pagina);
    paginacion.appendChild(siguiente);
    contenedor.appendChild(paginacion);
}

cargarMiembros();
