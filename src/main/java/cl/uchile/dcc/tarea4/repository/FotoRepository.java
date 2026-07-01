package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Foto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FotoRepository extends JpaRepository<Foto, Integer> {
}
