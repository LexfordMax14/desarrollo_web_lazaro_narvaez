package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Foto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String rutaArchivo;
    private String nombreArchivo;
    private Boolean eliminada = false;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Integer getId() { return id; }
    public String getRutaArchivo() { return rutaArchivo; }
    public String getNombreArchivo() { return nombreArchivo; }
    public Actividad getActividad() { return actividad; }
    public Boolean getEliminada() { return eliminada; }

    public void setRutaArchivo(String rutaArchivo) { this.rutaArchivo = rutaArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
    public void setEliminada(Boolean eliminada) { this.eliminada = eliminada; }
}
