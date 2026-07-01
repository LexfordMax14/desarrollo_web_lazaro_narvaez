package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Miembro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String email;
    private String telefono;
    private LocalDateTime fechaRegistro;

    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    @JsonIgnore
    @OneToMany(mappedBy = "miembro", cascade = CascadeType.ALL)
    private List<Actividad> actividades;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public Comuna getComuna() { return comuna; }
    public List<Actividad> getActividades() { return actividades; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public void setComuna(Comuna comuna) { this.comuna = comuna; }
}
