package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.Actividad;
import cl.uchile.dcc.tarea4.repository.ActividadRepository;
import cl.uchile.dcc.tarea4.repository.NotaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class ApiBuscadorController {

    private final ActividadRepository actividadRepo;
    private final NotaRepository notaRepo;

    public ApiBuscadorController(ActividadRepository actividadRepo, NotaRepository notaRepo) {
        this.actividadRepo = actividadRepo;
        this.notaRepo      = notaRepo;
    }

    @GetMapping("/api/buscar")
    public ResponseEntity<Map<String, Object>> buscar(
            @RequestParam(defaultValue = "") String q) {

        q = q.strip();
        if (q.length() < 3) {
            return ResponseEntity.ok(Map.of("success", false,
                "mensaje", "Ingrese al menos 3 caracteres.", "data", List.of()));
        }

        List<Actividad> actividades = actividadRepo.buscar(q);
        List<Map<String, Object>> data = new ArrayList<>();

        for (Actividad a : actividades) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", a.getId());
            item.put("nombre", a.getNombre());
            item.put("descripcion", a.getDescripcion() != null ? a.getDescripcion() : "");
            item.put("tipo", a.getTipo());
            item.put("dia", a.getDia());
            item.put("miembroNombre", a.getMiembro() != null ? a.getMiembro().getNombre() : "");
            item.put("comunaNombre", a.getMiembro() != null && a.getMiembro().getComuna() != null
                ? a.getMiembro().getComuna().getNombre() : "");

            long cantidad = notaRepo.countByActividadId(a.getId());
            Double promedio = cantidad > 0 ? notaRepo.calcularPromedio(a.getId()) : null;
            item.put("cantidadNotas", cantidad);
            item.put("promedioNota", promedio != null
                ? Math.round(promedio * 10.0) / 10.0 : null);
            data.add(item);
        }

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}
