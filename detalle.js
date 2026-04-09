const STORAGE_KEY = "registrosActividades";
const contenedorDetalle = document.getElementById("contenedor-detalle");
const registros = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const indice = Number(new URLSearchParams(window.location.search).get("indice"));
const registro = registros[indice];

if (!registro) {
    contenedorDetalle.innerHTML = "<p>No se encontro el registro solicitado.</p>";
} else {
    const detalles = [
        { etiqueta: "Nombre", valor: registro.nombre },
        { etiqueta: "Tipo de miembro", valor: registro.cargo },
        { etiqueta: "Correo", valor: registro.correo },
        { etiqueta: "Telefono", valor: registro.telefono },
        { etiqueta: "Categoria", valor: registro.categoria },
        { etiqueta: "Actividad", valor: registro.actividadNombre },
        { etiqueta: "Descripcion", valor: registro.descripcion },
        { etiqueta: "Dias", valor: registro.dias.join(", ") },
        { etiqueta: "Horario", valor: `${registro.horaInicio} - ${registro.horaFin}` },
        { etiqueta: "Archivo", valor: registro.archivoNombre },
        { etiqueta: "Link", valor: registro.link }
    ];

    const lista = document.createElement("dl");
    lista.className = "detalle-lista";

    detalles.forEach((detalle) => {
        const termino = document.createElement("dt");
        termino.textContent = detalle.etiqueta;

        const descripcion = document.createElement("dd");

        if (detalle.etiqueta === "Link") {
            const enlace = document.createElement("a");
            enlace.href = detalle.valor;
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";
            enlace.textContent = detalle.valor;
            descripcion.appendChild(enlace);
        } else {
            descripcion.textContent = detalle.valor;
        }

        lista.appendChild(termino);
        lista.appendChild(descripcion);
    });

    contenedorDetalle.replaceChildren(lista);
}
