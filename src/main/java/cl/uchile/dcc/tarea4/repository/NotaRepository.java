package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    long countByActividadId(Integer actividadId);

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double calcularPromedio(@Param("actividadId") Integer actividadId);
}
