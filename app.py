from datetime import UTC, datetime
import os

from flask import Flask, jsonify, render_template, request
from markupsafe import escape
from sqlalchemy import func
from werkzeug.utils import secure_filename

from db.db import SessionLocal
from db.models import Actividad, Comentario, Comuna, Foto, Miembro
from utils.comentario_validaciones import validar_comentario
from utils.registro_validaciones import validar_registro

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "static/uploads")

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def get_miembros():
    session = SessionLocal()
    try:
        return (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .limit(5)
            .all()
        )
    except Exception:
        return []
    finally:
        session.close()


def get_comunas():
    session = SessionLocal()
    try:
        return session.query(Comuna).all()
    except Exception:
        return []
    finally:
        session.close()


def build_form_data(request_obj):
    return {
        "nombre": request_obj.form.get("nombre", "").strip(),
        "email": request_obj.form.get("email", "").strip(),
        "telefono": request_obj.form.get("telefono", "").strip(),
        "comuna_id": request_obj.form.get("comuna_id", "").strip(),
    }


def build_actividades_data(request_obj):
    nombres = request_obj.form.getlist("nombre_actividad[]")
    descripciones = request_obj.form.getlist("descripcion[]")
    tipos = request_obj.form.getlist("tipo[]")
    dias = request_obj.form.getlist("dia[]")
    horas_inicio = request_obj.form.getlist("hora_inicio[]")
    duraciones = request_obj.form.getlist("duracion[]")

    total = max(
        len(nombres),
        len(descripciones),
        len(tipos),
        len(dias),
        len(horas_inicio),
        len(duraciones),
        1,
    )

    actividades = []
    for i in range(total):
        actividades.append(
            {
                "nombre": nombres[i].strip() if i < len(nombres) else "",
                "descripcion": descripciones[i].strip() if i < len(descripciones) else "",
                "tipo": tipos[i].strip() if i < len(tipos) else "",
                "dia": dias[i].strip() if i < len(dias) else "",
                "hora_inicio": horas_inicio[i].strip() if i < len(horas_inicio) else "",
                "duracion": duraciones[i].strip() if i < len(duraciones) else "",
            }
        )

    return actividades


def miembro_to_dict(miembro):
    return {
        "id": miembro.id,
        "nombre": miembro.nombre,
        "email": miembro.email,
        "telefono": miembro.telefono,
        "fecha_registro": miembro.fecha_registro.isoformat() if miembro.fecha_registro else None,
        "comuna_id": miembro.comuna_id,
    }


def actividad_to_dict(actividad):
    return {
        "id": actividad.id,
        "nombre": actividad.nombre,
        "dia": actividad.dia,
        "hora_inicio": actividad.hora_inicio,
        "duracion": actividad.duracion,
        "tipo": actividad.tipo,
        "descripcion": actividad.descripcion,
        "miembro_id": actividad.miembro_id,
    }


def foto_to_dict(foto):
    return {
        "id": foto.id,
        "nombre_archivo": foto.nombre_archivo,
        "ruta_archivo": f"static/uploads/{os.path.basename(foto.nombre_archivo)}",
        "actividad_id": foto.actividad_id,
    }


def comentario_to_dict(comentario):
    return {
        "id": comentario.id,
        "nombre": comentario.nombre,
        "texto": comentario.texto,
        "fecha": comentario.fecha.isoformat() if comentario.fecha else None,
    }


@app.route("/", methods=["GET"])
def index():
    miembros_recientes = get_miembros()
    return render_template("index.html", miembros_recientes=miembros_recientes)


@app.route("/registro", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        nombre = request.form.get("nombre", "").strip()
        email = request.form.get("email", "").strip()
        telefono = request.form.get("telefono", "").strip()
        comuna_id = request.form.get("comuna_id", "").strip()

        nombres_actividad = request.form.getlist("nombre_actividad[]")
        descripciones = request.form.getlist("descripcion[]")
        tipos = request.form.getlist("tipo[]")
        dias = request.form.getlist("dia[]")
        horas_inicio = request.form.getlist("hora_inicio[]")
        duraciones = request.form.getlist("duracion[]")
        archivos = request.files.getlist("archivo[]")

        errores = validar_registro(
            nombre,
            email,
            telefono,
            comuna_id,
            nombres_actividad,
            tipos,
            dias,
            horas_inicio,
            duraciones,
            archivos,
        )

        if errores:
            comunas = get_comunas()
            return render_template(
                "registro.html",
                comunas=comunas,
                errores=errores,
                form_data=build_form_data(request),
                actividades_data=build_actividades_data(request),
            )

        session = SessionLocal()
        try:
            nuevo_miembro = Miembro(
                nombre=nombre,
                email=email,
                telefono=telefono,
                fecha_registro=datetime.now(UTC),
                comuna_id=int(comuna_id),
            )
            session.add(nuevo_miembro)
            session.flush()

            for i, nombre_actividad in enumerate(nombres_actividad):
                nueva_actividad = Actividad(
                    miembro_id=nuevo_miembro.id,
                    dia=dias[i],
                    hora_inicio=horas_inicio[i],
                    duracion=duraciones[i],
                    tipo=tipos[i],
                    nombre=nombre_actividad,
                    descripcion=descripciones[i],
                )
                session.add(nueva_actividad)
                session.flush()

                if i < len(archivos) and archivos[i] and archivos[i].filename:
                    filename = secure_filename(archivos[i].filename)
                    nombre_base, extension = os.path.splitext(filename)
                    filename = f"{nombre_base}_{int(datetime.now(UTC).timestamp())}_{i}{extension}"
                    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    archivos[i].save(filepath)

                    nueva_foto = Foto(
                        ruta_archivo=filepath,
                        nombre_archivo=filename,
                        actividad_id=nueva_actividad.id,
                    )
                    session.add(nueva_foto)

            session.commit()

            miembros_recientes = get_miembros()
            mensaje_exito = (
                f"Registro exitoso. Se registro {escape(nombre)} con "
                f"{len(nombres_actividad)} actividad(es)."
            )
            return render_template(
                "index.html",
                mensaje=mensaje_exito,
                miembros_recientes=miembros_recientes,
            )
        except Exception as e:
            session.rollback()
            errores = [f"Error al guardar en la base de datos: {str(e)}"]
            comunas = get_comunas()
            return render_template(
                "registro.html",
                comunas=comunas,
                errores=errores,
                form_data=build_form_data(request),
                actividades_data=build_actividades_data(request),
            )
        finally:
            session.close()

    comunas = get_comunas()
    return render_template(
        "registro.html",
        comunas=comunas,
        form_data={},
        actividades_data=[{}],
    )


@app.route("/listado", methods=["GET"])
def listado():
    return render_template("listado.html")


@app.route("/detalle", methods=["GET"])
@app.route("/detalle/<int:miembro_id>", methods=["GET"])
def detalle(miembro_id=None):
    return render_template("detalle.html", miembro_id=miembro_id)


@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")


@app.route("/api/estadisticas/miembros-por-dia", methods=["GET"])
def api_estadisticas_miembros_por_dia():
    session = SessionLocal()
    try:
        filas = (
            session.query(
                func.date(Miembro.fecha_registro).label("dia"),
                func.count(Miembro.id).label("total"),
            )
            .group_by("dia")
            .order_by("dia")
            .all()
        )
        data = [
            {"date": fila.dia.strftime("%Y-%m-%d"), "count": fila.total}
            for fila in filas
        ]
        return jsonify(data)
    finally:
        session.close()


@app.route("/api/estadisticas/actividades-por-tipo", methods=["GET"])
def api_estadisticas_actividades_por_tipo():
    session = SessionLocal()
    try:
        filas = (
            session.query(
                Actividad.tipo.label("tipo"),
                func.count(Actividad.id).label("total"),
            )
            .group_by(Actividad.tipo)
            .order_by(func.count(Actividad.id).desc())
            .all()
        )
        data = [{"tipo": fila.tipo, "total": fila.total} for fila in filas]
        return jsonify(data)
    finally:
        session.close()


@app.route("/api/estadisticas/actividades-por-comuna", methods=["GET"])
def api_estadisticas_actividades_por_comuna():
    session = SessionLocal()
    try:
        filas = (
            session.query(
                Comuna.nombre.label("comuna"),
                func.count(Actividad.id).label("total"),
            )
            .join(Miembro, Miembro.comuna_id == Comuna.id)
            .join(Actividad, Actividad.miembro_id == Miembro.id)
            .group_by(Comuna.id)
            .order_by(func.count(Actividad.id).desc())
            .all()
        )
        data = [{"comuna": fila.comuna, "total": fila.total} for fila in filas]
        return jsonify(data)
    finally:
        session.close()


@app.route("/api/miembros", methods=["GET"])
def api_miembros():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    session = SessionLocal()
    try:
        total = session.query(Miembro).count()
        offset = (page - 1) * limit
        miembros = (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return jsonify(
            {
                "success": True,
                "total": total,
                "page": page,
                "limit": limit,
                "data": [miembro_to_dict(miembro) for miembro in miembros],
            }
        )
    finally:
        session.close()


@app.route("/api/miembro/<int:miembro_id>", methods=["GET"])
def api_miembro_detalle(miembro_id):
    session = SessionLocal()
    try:
        miembro = session.query(Miembro).filter_by(id=miembro_id).first()
        if not miembro:
            return jsonify({"success": False, "error": "Miembro no encontrado"}), 404

        actividades = session.query(Actividad).filter_by(miembro_id=miembro_id).all()
        actividades_data = []
        for actividad in actividades:
            actividad_data = actividad_to_dict(actividad)
            fotos = session.query(Foto).filter_by(actividad_id=actividad.id).all()
            actividad_data["fotos"] = [foto_to_dict(foto) for foto in fotos]
            actividades_data.append(actividad_data)

        miembro_data = miembro_to_dict(miembro)
        miembro_data["actividades"] = actividades_data
        miembro_data["comuna"] = (
            {"id": miembro.comuna.id, "nombre": miembro.comuna.nombre}
            if miembro.comuna
            else None
        )

        return jsonify({"success": True, "data": miembro_data})
    finally:
        session.close()


@app.route("/api/actividad/<int:actividad_id>/comentarios", methods=["GET"])
def api_comentarios_listar(actividad_id):
    """Lista los comentarios de una actividad, del mas reciente al mas antiguo."""
    session = SessionLocal()
    try:
        actividad = session.query(Actividad).filter_by(id=actividad_id).first()
        if not actividad:
            return jsonify({"success": False, "error": "Actividad no encontrada"}), 404

        comentarios = (
            session.query(Comentario)
            .filter_by(actividad_id=actividad_id)
            .order_by(Comentario.fecha.desc())
            .all()
        )
        return jsonify(
            {
                "success": True,
                "data": [comentario_to_dict(c) for c in comentarios],
            }
        )
    finally:
        session.close()


@app.route("/api/actividad/<int:actividad_id>/comentarios", methods=["POST"])
def api_comentarios_agregar(actividad_id):
    """Valida en el servidor e inserta un nuevo comentario para la actividad."""
    datos = request.get_json(silent=True) or {}
    nombre = (datos.get("nombre") or "").strip()
    texto = (datos.get("texto") or "").strip()

    errores = validar_comentario(nombre, texto)

    session = SessionLocal()
    try:
        actividad = session.query(Actividad).filter_by(id=actividad_id).first()
        if not actividad:
            return jsonify({"success": False, "errores": ["Actividad no encontrada"]}), 404

        if errores:
            return jsonify({"success": False, "errores": errores}), 400

        comentario = Comentario(
            nombre=nombre,
            texto=texto,
            fecha=datetime.now(UTC),
            actividad_id=actividad_id,
        )
        session.add(comentario)
        session.commit()
        return jsonify({"success": True, "data": comentario_to_dict(comentario)}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errores": [f"Error al guardar: {str(e)}"]}), 500
    finally:
        session.close()


if __name__ == "__main__":
    app.run(debug=True, port=5001)
