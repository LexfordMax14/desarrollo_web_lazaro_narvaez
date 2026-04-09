# Actividad DCC

Proyecto web simple para registrar, listar y visualizar actividades usando HTML, CSS, JavaScript y `localStorage`.

## Estructura del proyecto

- `index.html`: página principal con enlaces a las distintas vistas del proyecto.
- `registro.html`: formulario de registro de actividades.
- `validaciones.js`: valida los campos del formulario, construye el objeto del registro y lo guarda en `localStorage`.
- `listado.html`: vista del listado de registros.
- `listado.js`: muestra los registros en tabla, permite filtrar, ordenar, paginar y abrir el detalle.
- `detalle.html`: vista de detalle de un registro.
- `detalle.js`: lee el índice enviado en la URL y muestra la información del registro seleccionado.
- `estadisticas.html`: página de estadísticas con gráficos estáticos.
- `styles.css`: estilos compartidos por todo el sitio.

## Flujo principal

1. El usuario completa el formulario en `registro.html`.
2. `validaciones.js` verifica que los campos obligatorios no estén vacíos y valida el formato de correo, teléfono y contraseña.
3. Si el formulario es válido, el registro se guarda en `localStorage` bajo la clave `registrosActividades`.
4. `listado.js` lee esos registros, los muestra en una tabla y genera un enlace `detalle.html?indice=...` para cada fila.
5. `detalle.js` toma ese índice desde la URL y muestra los datos completos del registro.

## Datos que se guardan

Cada registro guardado incluye:

- `categoria`
- `nombre`
- `cargo`
- `telefono`
- `correo`
- `actividadNombre`
- `descripcion`
- `dias`
- `horaInicio`
- `horaFin`
- `archivoNombre`
- `link`

Nota: en `archivoNombre` solo se guarda el nombre del archivo seleccionado, no el archivo completo.

## Funcionalidades implementadas

- Registro de actividades con validación en JavaScript.
- Mensajes de error por campo.
- Almacenamiento de datos en `localStorage`.
- Listado dinámico en tabla.
- Filtro por tipo de miembro.
- Orden por nombre, correo o categoría.
- Paginación simple.
- Vista de detalle por registro.
- Vista de estadísticas con imágenes estáticas.

## Consideraciones técnicas

- Los scripts se cargan al final del `body`, por eso `validaciones.js`, `listado.js` y `detalle.js` se ejecutan sin usar `DOMContentLoaded`.
- El detalle se identifica por el índice del registro dentro del arreglo guardado en `localStorage`.
- Si no hay registros guardados, el listado muestra un mensaje informativo.
- Si el índice de la URL no corresponde a un registro válido, la vista de detalle muestra un mensaje de error.
- El proyecto no usa backend ni base de datos; toda la persistencia depende del almacenamiento local del navegador.

## Cómo usar

1. Abrir `index.html` en el navegador.
2. Entrar a `Registro` y completar el formulario.
3. Revisar los registros en `Listado`.
4. Abrir `Ver detalle` para ver la información completa de un registro.
5. Entrar a `Estadísticas` para ver los gráficos.

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- `localStorage`

## Decisiones para la corrección

- Las validaciones del formulario se realizan en `validaciones.js`. Se quitaron los atributos `required` para que la validación dependa de JavaScript.
- El detalle de cada registro se consulta usando el índice enviado en la URL (`detalle.html?indice=...`) y no mediante un identificador adicional.
- En el campo de archivo solo se guarda `archivoNombre`, es decir, el nombre del archivo seleccionado. No se almacena el contenido del archivo porque el proyecto se resolvió como prototipo sin backend.
- El orden por datos de contacto se implementa usando el correo electrónico.
- La persistencia se resolvió con `localStorage` para poder navegar entre vistas y mostrar listados y detalles dentro del prototipo.

## Nota

El archivo `styles.css` y este `README.md` fueron co-hechos con inteligencia artificial como apoyo para el diseño visual y la documentación base del proyecto.
