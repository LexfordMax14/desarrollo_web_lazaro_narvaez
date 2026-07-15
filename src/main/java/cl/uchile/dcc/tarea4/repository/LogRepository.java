package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    List<Log> findAllByOrderByFechaDescIdDesc();
}
