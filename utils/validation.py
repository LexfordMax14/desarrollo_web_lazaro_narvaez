import re


def validar_email(email):
    patron = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(patron, email) is not None


def validar_telefono(telefono):
    return re.match(r'^9\d{8}$', telefono) is not None
