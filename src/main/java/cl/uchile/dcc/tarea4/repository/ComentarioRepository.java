package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByActividadIdOrderByFechaDesc(Integer actividadId);
}
