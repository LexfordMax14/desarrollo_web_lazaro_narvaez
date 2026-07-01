package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.repository.*;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.*;

@RestController
@RequestMapping("/api/estadisticas")
public class ApiEstadisticasController {

    @PersistenceContext
    private EntityManager em;

    @GetMapping("/miembros-por-dia")
    public List<Map<String, Object>> miembrosPorDia() {
        List<?> rows = em.createQuery(
            "SELECT cast(m.fechaRegistro as date), COUNT(m.id) FROM Miembro m " +
            "GROUP BY cast(m.fechaRegistro as date) ORDER BY cast(m.fechaRegistro as date)"
        ).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] r = (Object[]) row;
            result.add(Map.of("date", r[0].toString(), "count", r[1]));
        }
        return result;
    }

    @GetMapping("/actividades-por-tipo")
    public List<Map<String, Object>> actividadesPorTipo() {
        List<?> rows = em.createQuery(
            "SELECT a.tipo, COUNT(a.id) FROM Actividad a GROUP BY a.tipo ORDER BY COUNT(a.id) DESC"
        ).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] r = (Object[]) row;
            result.add(Map.of("tipo", r[0], "total", r[1]));
        }
        return result;
    }

    @GetMapping("/actividades-por-comuna")
    public List<Map<String, Object>> actividadesPorComuna() {
        List<?> rows = em.createQuery(
            "SELECT c.nombre, COUNT(a.id) FROM Actividad a " +
            "JOIN a.miembro m JOIN m.comuna c " +
            "GROUP BY c.id, c.nombre ORDER BY COUNT(a.id) DESC"
        ).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] r = (Object[]) row;
            result.add(Map.of("comuna", r[0], "total", r[1]));
        }
        return result;
    }
}
