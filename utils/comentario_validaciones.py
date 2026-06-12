"""
Validaciones de servidor para los comentarios de actividades.
Las mismas reglas se aplican en el cliente para dar retroalimentacion
inmediata, pero el servidor siempre vuelve a validar.
"""

NOMBRE_MIN = 3
NOMBRE_MAX = 80
TEXTO_MIN = 5
TEXTO_MAX = 300


def validar_comentario(nombre, texto):
    errores = []

    nombre = (nombre or "").strip()
    texto = (texto or "").strip()

    if len(nombre) < NOMBRE_MIN or len(nombre) > NOMBRE_MAX:
        errores.append(
            f"El nombre del comentarista debe tener entre {NOMBRE_MIN} y {NOMBRE_MAX} caracteres"
        )

    if len(texto) < TEXTO_MIN:
        errores.append(
            f"El comentario debe tener al menos {TEXTO_MIN} caracteres"
        )

    if len(texto) > TEXTO_MAX:
        errores.append(
            f"El comentario no puede superar los {TEXTO_MAX} caracteres"
        )

    return errores
