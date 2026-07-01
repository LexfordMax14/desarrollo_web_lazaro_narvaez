package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String texto;
    private LocalDateTime fecha;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTexto() { return texto; }
    public LocalDateTime getFecha() { return fecha; }
    public Actividad getActividad() { return actividad; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setTexto(String texto) { this.texto = texto; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
}
