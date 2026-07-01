package cl.uchile.dcc.tarea4.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @JsonIgnore
    @OneToMany(mappedBy = "comuna")
    private List<Miembro> miembros;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public Region getRegion() { return region; }
}
