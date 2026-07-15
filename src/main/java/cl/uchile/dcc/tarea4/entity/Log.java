package cl.uchile.dcc.tarea4.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;

    private String mensaje;

    public Log() {
    }

    public Log(String mensaje) {
        this.mensaje = mensaje;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public LocalDateTime getFecha() { return fecha; }
    public String getMensaje() { return mensaje; }

    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
