package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Miembro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MiembroRepository extends JpaRepository<Miembro, Integer> {
    Page<Miembro> findAllByOrderByFechaRegistroDesc(Pageable pageable);
}
