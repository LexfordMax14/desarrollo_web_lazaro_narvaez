package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer nota;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Integer getId() { return id; }
    public Integer getNota() { return nota; }
    public Actividad getActividad() { return actividad; }

    public void setNota(Integer nota) { this.nota = nota; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
}
