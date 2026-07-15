# Tarea 5 — CC5002

Tres nuevas funcionalidades sobre el proyecto **Spring Boot 3.5.0** (Java 17+), incorporando **Spring Security** para el control de acceso.

## Nuevas funcionalidades (Tarea 5)

### 1. Administrador de fotos (`/admin-fotos`) — acceso restringido
- Galería de las fotos **vigentes** (no eliminadas), ordenadas de la más reciente a la más antigua.
- Cada tarjeta muestra la foto, la **fecha de registro**, la **comuna** y el **email** del miembro que informó la actividad.
- Botón **"Marcar como eliminada"**: abre un modal que solicita el **motivo** (obligatorio, entre 5 y 200 caracteres, validado en cliente y servidor).
- Al confirmar: se actualiza `foto.eliminada = 1` y se inserta un registro en la tabla `log` con el mensaje  
  `eliminado foto {id-foto} por usuario admin, motivo: {motivo}`.
- Acceso solo para el usuario **`cc5002`** / contraseña **`examen`**.

### 2. Mensajes log (`/mensajes-log`) — acceso restringido
- Despliega en una tabla todo el contenido de la tabla `log` (`id`, `fecha`, `mensaje`), de la más reciente a la más antigua.
- Acceso para **`cc5002`** / `examen` y para **`auditor`** / `log-auditor`.

### 3. Estadística de fotos (`/estadistica-fotos`) — acceso público
- Gráfico de torta (Highcharts) con el total de **fotos vigentes** vs. **fotos eliminadas**.

## Seguridad (Spring Security)

- Autenticación mediante **HTTP Basic** (ventana de usuario/contraseña del navegador).
- Usuarios en memoria (`InMemoryUserDetailsManager`):
  - `cc5002` / `examen` → roles `ADMIN` y `AUDITOR`.
  - `auditor` / `log-auditor` → rol `AUDITOR`.
- Reglas de autorización (`SecurityConfig`):
  - `/admin-fotos` y `/api/admin-fotos/**` → rol `ADMIN`.
  - `/mensajes-log` y `/api/mensajes-log/**` → rol `AUDITOR`.
  - Todo lo demás (incluido `/estadistica-fotos`) → público.
- CSRF desactivado para permitir las peticiones AJAX (`POST`) de la galería.

## Endpoints nuevos (Tarea 5)

| Método | URL | Acceso | Descripción |
|--------|-----|--------|-------------|
| GET | `/admin-fotos` | ADMIN | Página de la galería de administración |
| GET | `/api/admin-fotos/lista` | ADMIN | Fotos vigentes con datos del miembro |
| POST | `/api/admin-fotos/eliminar` | ADMIN | Marca `eliminada` y registra en `log` |
| GET | `/mensajes-log` | AUDITOR | Página con la tabla de log |
| GET | `/api/mensajes-log/lista` | AUDITOR | Contenido de la tabla `log` |
| GET | `/estadistica-fotos` | Público | Página con el gráfico de fotos |
| GET | `/api/estadistica-fotos/datos` | Público | Total de fotos vigentes y eliminadas |

## Puesta en marcha (Tarea 5)

1. Aplicar las modificaciones de base de datos incluidas en `modificaciones-base-datos.sql`
   (agrega la columna `eliminada` a `foto` y crea la tabla `log`):
   ```bash
   mysql -u root -p tarea2 < modificaciones-base-datos.sql
   ```
2. Ejecutar la aplicación con `mvn spring-boot:run` y abrir `http://localhost:8080`.

> **Nota para la corrección:** las funciones nuevas se agregaron sobre el proyecto Spring Boot de la Tarea 4.
> La galería usa la ruta de la foto (`ruta_archivo`) para mostrar la imagen desde `static/uploads/`.
> El gráfico de la estadística usa Highcharts (biblioteca externa por CDN).

---

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
