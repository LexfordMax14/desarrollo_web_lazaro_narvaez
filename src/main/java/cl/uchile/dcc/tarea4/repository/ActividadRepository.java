package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.entity.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("""
        SELECT DISTINCT a FROM Actividad a
        JOIN FETCH a.miembro m
        JOIN FETCH m.comuna c
        WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    List<Actividad> buscar(@Param("q") String q);
}
