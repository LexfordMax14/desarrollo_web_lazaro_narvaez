# Tarea 2 v2

Aplicacion web desarrollada con Flask y MySQL para registrar miembros y sus actividades.

## Descripcion

Esta entrega corresponde a una adaptacion de la Tarea 1 al contexto de Python con Flask y base de datos MySQL. Se mantuvo la logica principal del prototipo y se ajustaron algunos nombres de campos para alinearlos con el modelo relacional usado en esta version.

## Funcionalidades

- Portada con menu principal
- Registro de miembros y actividades
- Validaciones en cliente con JavaScript
- Validaciones en servidor con Flask
- Guardado en base de datos de:
  - miembro
  - actividad
  - foto
- Almacenamiento de archivos en `static/uploads`
- Listado paginado de miembros
- Detalle de miembro con actividades y fotos
- Vista de estadisticas con imagenes

## Requisitos

- Python 3
- MySQL

## Dependencias

Instalar con:

```bash
pip install -r requeriments.txt
```

## Base de datos

La configuracion actual esta en [db.py](./db/db.py) y usa:

- Base de datos: `tarea2`
- Host: `localhost`
- Puerto: `3306`
- Usuario: `cc5002`
- Password: `programacionweb`

Antes de ejecutar la app, asegurate de:

1. crear la base de datos `tarea2`
2. ejecutar el script [tarea2.sql](./db/tarea2.sql)
3. cargar regiones y comunas con [region-comuna.sql](./db/region-comuna.sql)

La interaccion con la base de datos se realiza mediante SQLAlchemy.

## Ejecucion

Desde la carpeta `tarea2v2`:

```bash
python app.py
```

La aplicacion queda disponible en:

```text
http://127.0.0.1:5001
```

## Estructura general

- [app.py](./app.py): rutas Flask
- [db](./db): conexion y modelos
- [templates](./templates): vistas HTML
- [static](./static): CSS, JavaScript, imagenes y uploads
- [utils](./utils): validaciones backend

## Consideraciones

- La aplicacion fue construida usando HTML5, CSS3, Python y Flask.
- Se utiliza SQLAlchemy para la interaccion con MySQL.
- La columna `fecha_registro` se completa al momento de registrar un miembro.
- El formulario mantiene validaciones en cliente con JavaScript y tambien valida en servidor.
- Se consideraron entradas de texto maliciosas usando el escape por defecto de Jinja, `escape()` en mensajes visibles y `secure_filename()` para nombres de archivo.
- El archivo [tarea2.sql](./db/tarea2.sql) permite crear la estructura principal de la base de datos.
- El archivo [region-comuna.sql](./db/region-comuna.sql) permite cargar regiones y comunas.
- Para validacion HTML y CSS, se recomienda revisar el HTML renderizado por Flask y no directamente los templates Jinja.
- Esta tarea fue preparada para entrega en un repositorio GitHub con README incluido.

## Nota de implementacion

Esta version corresponde a una adaptacion de la Tarea 1 al contexto de Flask y MySQL, manteniendo la logica general del prototipo y ajustando algunos nombres de campos al modelo de datos implementado.

Ademas, la redaccion de este README y la construccion del archivo CSS fueron realizadas con apoyo de IA.
