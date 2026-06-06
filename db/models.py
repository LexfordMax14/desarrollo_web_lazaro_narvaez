"""
Modelos SQLAlchemy para la base de datos tarea2
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.db import Base


class Region(Base):
    __tablename__ = "region"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    
    # Relación con Comuna
    comunas = relationship("Comuna", back_populates="region", cascade="all, delete")


class Comuna(Base):
    __tablename__ = "comuna"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    
    # Relación con Region
    region = relationship("Region", back_populates="comunas")
    # Relación con Miembro
    miembros = relationship("Miembro", back_populates="comuna", cascade="all, delete")


class Miembro(Base):
    __tablename__ = "miembro"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False, default=datetime.utcnow)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    
    # Relación con Comuna
    comuna = relationship("Comuna", back_populates="miembros")
    # Relación con Actividad
    actividades = relationship("Actividad", back_populates="miembro", cascade="all, delete")


class Actividad(Base):
    __tablename__ = "actividad"
    
    id = Column(Integer, primary_key=True)
    miembro_id = Column(Integer, ForeignKey("miembro.id"), nullable=False)
    dia = Column(Enum('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'), nullable=False)
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(Enum('arte', 'deporte', 'tecnología', 'social', 'recreación', 'otra'), nullable=False)
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=True)
    
    # Relación con Miembro
    miembro = relationship("Miembro", back_populates="actividades")
    # Relación con Foto
    fotos = relationship("Foto", back_populates="actividad", cascade="all, delete")
    # Relación con Comentario
    comentarios = relationship("Comentario", back_populates="actividad", cascade="all, delete")


class Foto(Base):
    __tablename__ = "foto"
    
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)
    
    # Relación con Actividad
    actividad = relationship("Actividad", back_populates="fotos", cascade="all, delete")


class Comentario(Base):
    __tablename__ = "comentario"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)

    # Relación con Actividad
    actividad = relationship("Actividad", back_populates="comentarios")
