# Tarea 3

Aplicación web desarrollada con Flask y MySQL para registrar miembros y sus actividades extraprogramáticas. Esta entrega amplía la Tarea 2 agregando **estadísticas con gráficos** y **comentarios a las actividades**.

## Descripción

Sobre la base de la Tarea 2 (registro de miembros, actividades y fotos, listado y detalle), en la Tarea 3 se incorporan dos funcionalidades nuevas:

1. **Estadísticas** con tres gráficos generados en el cliente.
2. **Comentarios** a las actividades: agregar y listar de forma asíncrona.

## Funcionalidades nuevas (Tarea 3)

### Estadísticas

Tres gráficos dibujados en el navegador con **Highcharts**, que obtienen los datos vía `fetch` a endpoints de Flask:

- **Gráfico de líneas:** cantidad de miembros registrados por día.
- **Gráfico de torta:** total de actividades por tipo.
- **Gráfico de barras (columnas):** total de actividades por comuna.

La página incluye un enlace para volver a la portada.

### Comentarios

En la vista de detalle, cada actividad muestra:

- Un **listado** de sus comentarios (fecha, nombre del comentarista y texto), cargado de forma asíncrona.
- Un **formulario** para agregar un nuevo comentario, con nombre (obligatorio, 3 a 80 caracteres) y texto (obligatorio, área de 4 filas y 50 columnas, mínimo 5 caracteres).

La validación se realiza tanto en el cliente (antes de enviar) como en el servidor. Si el servidor rechaza el comentario, el formulario se mantiene visible mostrando los errores.

## Endpoints nuevos

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/estadisticas/miembros-por-dia` | `[{date, count}]` para el gráfico de líneas |
| GET | `/api/estadisticas/actividades-por-tipo` | `[{tipo, total}]` para el gráfico de torta |
| GET | `/api/estadisticas/actividades-por-comuna` | `[{comuna, total}]` para el gráfico de barras |
| GET | `/api/actividad/<id>/comentarios` | Lista los comentarios de una actividad |
| POST | `/api/actividad/<id>/comentarios` | Valida e inserta un comentario nuevo |

## Requisitos

- Python 3
- MySQL

## Dependencias

Instalar con:

```bash
pip install -r requeriments.txt
```

Highcharts se carga por CDN, no requiere instalación.

## Base de datos

La configuración está en [db.py](./db/db.py). Antes de ejecutar la app:

1. Crear la base de datos `tarea2`.
2. Ejecutar el script [tarea2.sql](./db/tarea2.sql) (estructura principal).
3. Cargar regiones y comunas con [region-comuna.sql](./db/region-comuna.sql).
4. Crear la tabla de comentarios con [tabla-comentario.sql](./db/tabla-comentario.sql).

La interacción con la base de datos se realiza mediante SQLAlchemy.

## Ejecución

```bash
python app.py
```

La aplicación queda disponible en `http://127.0.0.1:5001`.

## Estructura general

- [app.py](./app.py): rutas Flask y endpoints de la API
- [db](./db): conexión y modelos
- [templates](./templates): vistas HTML
- [static](./static): CSS, JavaScript, imágenes y uploads
- [utils](./utils): validaciones de servidor

## Decisiones de implementación

- **Highcharts** (licencia gratuita para uso no comercial/educativo) para los gráficos, cargada por CDN. El enunciado la lista como opción válida.
- Los gráficos se generan en el **cliente** con `fetch` (async/await) a endpoints que devuelven JSON; el servidor solo entrega datos ya agregados con `GROUP BY`/`COUNT` para que el conteo lo haga MySQL y no Python.
- Cada gráfico se dibuja en su propia función con su propio `try/catch`, de modo que si un endpoint falla, los demás gráficos se siguen mostrando.
- Los comentarios se agregan y listan con **llamadas asíncronas** (`fetch`). El POST envía JSON y el servidor responde con códigos HTTP (201, 400, 404) y mensajes de error.
- **Validación doble** (cliente y servidor) con las mismas reglas para los comentarios.
- **Entradas maliciosas:** al pintar los comentarios en el DOM se usa `textContent` (no `innerHTML`), evitando inyección de HTML/XSS; los templates usan el escape automático de Jinja.
- En la vista de detalle, cada actividad se renderiza como un `<article>` independiente (en vez de dentro de una lista de definiciones) para mantener HTML5 válido al incluir el formulario.

## Consideraciones

- Construida con HTML5, CSS3, Python y Flask, usando SQLAlchemy para MySQL.
- Para validación HTML/CSS con los validadores de W3C, revisar el HTML renderizado por Flask y no directamente los templates Jinja.
- Parte de la redacción de este README y del CSS fue realizada con apoyo de IA.
