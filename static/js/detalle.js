const contenedorDetalle = document.getElementById("contenedor-detalle");

async function cargarDetalle() {
    try {
        if (!miembro_id) {
            contenedorDetalle.innerHTML = "<p>Error: No se especifico un miembro.</p>";
            return;
        }

        const response = await fetch(`/api/miembro/${miembro_id}`);
        const result = await response.json();

        if (!result.success) {
            contenedorDetalle.innerHTML = "<p>No se encontro el registro solicitado.</p>";
            return;
        }

        const miembro = result.data;
        const lista = document.createElement("dl");

        const detalles = [
            { etiqueta: "Nombre", valor: miembro.nombre },
            { etiqueta: "Email", valor: miembro.email },
            { etiqueta: "Telefono", valor: miembro.telefono },
            { etiqueta: "Comuna", valor: miembro.comuna ? miembro.comuna.nombre : "N/A" },
            { etiqueta: "Fecha Registro", valor: new Date(miembro.fecha_registro).toLocaleDateString("es-ES") },
        ];

        detalles.forEach((detalle) => {
            const termino = document.createElement("dt");
            termino.textContent = detalle.etiqueta;
            const descripcion = document.createElement("dd");
            descripcion.textContent = detalle.valor;
            lista.appendChild(termino);
            lista.appendChild(descripcion);
        });

        if (miembro.actividades && miembro.actividades.length > 0) {
            const titulo = document.createElement("dt");
            titulo.textContent = "Actividades";
            lista.appendChild(titulo);

            miembro.actividades.forEach((actividad, index) => {
                const nombre = document.createElement("dd");
                nombre.innerHTML = `<strong>Actividad ${index + 1}: ${actividad.nombre}</strong>`;
                lista.appendChild(nombre);

                const actividadDetalles = [
                    { etiqueta: "Tipo", valor: actividad.tipo },
                    { etiqueta: "Dia", valor: actividad.dia },
                    { etiqueta: "Hora Inicio", valor: actividad.hora_inicio },
                    { etiqueta: "Duracion", valor: actividad.duracion },
                    { etiqueta: "Descripcion", valor: actividad.descripcion || "Sin descripcion" },
                ];

                actividadDetalles.forEach((detalleActividad) => {
                    const item = document.createElement("dd");
                    item.innerHTML = `<strong>${detalleActividad.etiqueta}:</strong> ${detalleActividad.valor}`;
                    lista.appendChild(item);
                });

                if (actividad.fotos && actividad.fotos.length > 0) {
                    actividad.fotos.forEach((foto) => {
                        const fotoItem = document.createElement("dd");
                        const enlace = document.createElement("a");
                        enlace.href = `/${foto.ruta_archivo}`;
                        enlace.target = "_blank";
                        enlace.textContent = foto.nombre_archivo;
                        fotoItem.appendChild(enlace);
                        lista.appendChild(fotoItem);
                    });
                }
            });
        }

        contenedorDetalle.replaceChildren(lista);
    } catch (error) {
        contenedorDetalle.innerHTML = `<p>Error al cargar el detalle: ${error.message}</p>`;
    }
}

cargarDetalle();
