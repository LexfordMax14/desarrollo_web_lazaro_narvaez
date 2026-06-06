from utils.validation import validar_email, validar_telefono


TIPOS_ACTIVIDAD = ['arte', 'deporte', 'tecnología', 'social', 'recreación', 'otra']
DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
EXTENSIONES_IMAGEN = ('.jpg', '.jpeg', '.png')


def validar_registro_miembro(nombre, email, telefono, comuna_id):
    errores = []

    if not nombre or len(nombre) < 2:
        errores.append('El nombre debe tener al menos 2 caracteres')

    if not validar_email(email):
        errores.append('Email invalido')

    if not validar_telefono(telefono):
        errores.append('Telefono invalido (debe ser 9XXXXXXXX)')

    if not comuna_id or not comuna_id.isdigit():
        errores.append('Debe seleccionar una comuna valida')

    return errores


def validar_registro_actividades(nombres, tipos, dias, horas_inicio, duraciones, archivos):
    errores = []

    if not nombres:
        return ['Debe registrar al menos una actividad']

    for i, nombre in enumerate(nombres):
        numero = i + 1
        tipo = _obtener(tipos, i)
        dia = _obtener(dias, i)
        hora_inicio = _obtener(horas_inicio, i)
        duracion = _obtener(duraciones, i)
        archivo = archivos[i] if i < len(archivos) else None

        if not nombre or len(nombre.strip()) < 2:
            errores.append(f'Actividad {numero}: El nombre debe tener al menos 2 caracteres')

        if tipo not in TIPOS_ACTIVIDAD:
            errores.append(f'Actividad {numero}: Tipo de actividad invalido o vacio')

        if dia not in DIAS_SEMANA:
            errores.append(f'Actividad {numero}: Dia invalido o vacio')

        if not hora_inicio:
            errores.append(f'Actividad {numero}: Debe ingresar la hora de inicio')

        if not duracion:
            errores.append(f'Actividad {numero}: Debe ingresar la duracion')

        if archivo and archivo.filename:
            nombre_archivo = archivo.filename.lower()
            if not nombre_archivo.endswith(EXTENSIONES_IMAGEN):
                errores.append(
                    f'Actividad {numero}: Extension de archivo no permitida (jpg, jpeg, png)'
                )

    return errores


def validar_registro(nombre, email, telefono, comuna_id, nombres, tipos, dias, horas_inicio, duraciones, archivos):
    errores = validar_registro_miembro(nombre, email, telefono, comuna_id)
    errores.extend(validar_registro_actividades(nombres, tipos, dias, horas_inicio, duraciones, archivos))
    return errores


def _obtener(lista, indice):
    return lista[indice].strip() if indice < len(lista) else ''
