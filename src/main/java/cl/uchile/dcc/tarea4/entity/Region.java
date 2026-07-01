package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    @JsonIgnore
    @OneToMany(mappedBy = "region")
    private List<Comuna> comunas;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public List<Comuna> getComunas() { return comunas; }
}
