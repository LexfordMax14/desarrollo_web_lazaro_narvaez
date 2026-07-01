package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "miembro_id")
    private Miembro miembro;

    private String dia;
    private String horaInicio;
    private String duracion;
    private String tipo;
    private String nombre;
    private String descripcion;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Foto> fotos;

    @JsonIgnore
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;

    @JsonIgnore
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Nota> notas;

    public Integer getId() { return id; }
    public Miembro getMiembro() { return miembro; }
    public String getDia() { return dia; }
    public String getHoraInicio() { return horaInicio; }
    public String getDuracion() { return duracion; }
    public String getTipo() { return tipo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public List<Foto> getFotos() { return fotos; }
    public List<Comentario> getComentarios() { return comentarios; }
    public List<Nota> getNotas() { return notas; }

    public void setMiembro(Miembro miembro) { this.miembro = miembro; }
    public void setDia(String dia) { this.dia = dia; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }
    public void setDuracion(String duracion) { this.duracion = duracion; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
