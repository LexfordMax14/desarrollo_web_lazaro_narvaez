# Tarea 4 — CC5002

Migración completa a **Spring Boot 3.5.0** (Java 17+) + JPA/Hibernate + MySQL.  
Agrega dos nuevas funcionalidades sobre la base de las tareas anteriores.

## Nuevas funcionalidades (Tarea 4)

### Buscador de actividades (`/buscador.html`)
- Campo de texto único; al escribir ≥ 3 caracteres dispara búsqueda automática (debounce 300 ms) con `fetch`.
- Busca en nombre de actividad, descripción y nombre de la comuna.
- Muestra mensaje si no hay resultados.
- Columnas: nombre del miembro, día, tipo, comuna, nombre y descripción.
- Texto coincidente resaltado con `<mark>` (escape XSS-safe previo).

### Sistema de notas (`/buscador.html`)
- Cada resultado muestra la nota promedio (`-` si sin evaluar) y un botón **Evaluar**.
- Al hacer clic se abre un `<dialog>` nativo con `<select>` 1–7.
- Validación doble: cliente (JS) y servidor (Spring Boot).
- `POST /api/actividad/{id}/notas` guarda la nota, recalcula el promedio y actualiza la celda sin recargar la página.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Spring Boot 3.5.0, Java 22, JPA/Hibernate |
| Base de datos | MySQL (`tarea2`), `ddl-auto=none` |
| Frontend | HTML5 estático + JavaScript (`fetch`) |
| Estilos | CSS3 propio |

## Decisiones técnicas

- **HTML estático** en `src/main/resources/static/`: no se usa Thymeleaf; todo el renderizado es del lado del cliente con `fetch`.
- **`<dialog>` nativo HTML5** para el modal de evaluación, sin dependencias externas.
- **Highlighting XSS-safe**: se escapan caracteres HTML antes de insertar `<mark>`.
- **`ddl-auto=none`**: la app usa la BD existente sin modificarla.
- **`@JsonIgnore`** en back-references de entidades para evitar recursión circular en la serialización JSON.
- Registro de miembros vía `fetch` con `FormData` (multipart); subida de fotos incluida.
- Las comunas del formulario de registro se cargan asíncronamente desde `GET /api/comunas`.
- Fotos de actividades guardadas en `static/uploads/` y servidas por un `ResourceHandler` personalizado.

## Endpoints principales

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/miembros` | Listado paginado de miembros |
| GET | `/api/miembro/{id}` | Detalle con actividades y fotos |
| POST | `/api/miembros` | Registro de nuevo miembro (multipart) |
| GET | `/api/comunas` | Lista de comunas para el formulario |
| GET | `/api/buscar?q=` | Búsqueda de actividades (mín. 3 chars) |
| POST | `/api/actividad/{id}/notas` | Agrega nota; devuelve nuevo promedio |
| GET | `/api/actividad/{id}/comentarios` | Lista comentarios de una actividad |
| POST | `/api/actividad/{id}/comentarios` | Agrega comentario (JSON) |
| GET | `/api/estadisticas/miembros-por-dia` | Datos para gráfico de líneas |
| GET | `/api/estadisticas/actividades-por-tipo` | Datos para gráfico de torta |
| GET | `/api/estadisticas/actividades-por-comuna` | Datos para gráfico de barras |

## Cómo ejecutar

1. Asegurarse de tener MySQL corriendo con la BD `tarea2`.
2. Haber ejecutado `db/tabla-nota.sql` para crear la tabla `nota`.
3. Ajustar usuario/contraseña en `src/main/resources/application.properties`.
4. Desde la raíz del proyecto:
   ```bash
   mvn spring-boot:run
   ```
5. Abrir `http://localhost:8080`.

---

# Tarea 3 — CC5002

Aplicación web desarrollada con Flask y MySQL. Agrega estadísticas con gráficos y comentarios a las actividades.

## Funcionalidades (Tarea 3)

- **Estadísticas**: tres gráficos (Highcharts) cargados con `fetch` — miembros por día, actividades por tipo y por comuna.
- **Comentarios**: listado y formulario asíncrono en el detalle de cada actividad, con validación cliente y servidor.

## Cómo ejecutar (Flask)

```bash
pip install -r requeriments.txt
python app.py
```

Disponible en `http://127.0.0.1:5001`.
