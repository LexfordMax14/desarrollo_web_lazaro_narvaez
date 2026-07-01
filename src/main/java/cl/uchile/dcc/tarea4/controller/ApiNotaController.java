package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.*;
import cl.uchile.dcc.tarea4.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class ApiNotaController {

    private final ActividadRepository actividadRepo;
    private final NotaRepository notaRepo;

    public ApiNotaController(ActividadRepository actividadRepo, NotaRepository notaRepo) {
        this.actividadRepo = actividadRepo;
        this.notaRepo      = notaRepo;
    }

    @PostMapping("/api/actividad/{id}/notas")
    public ResponseEntity<Map<String, Object>> agregar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        Optional<Actividad> actOpt = actividadRepo.findById(id);
        if (actOpt.isEmpty()) {
            return ResponseEntity.status(404)
                .body(Map.of("success", false, "errores", List.of("Actividad no encontrada")));
        }

        Object notaRaw = body.get("nota");
        if (notaRaw == null) {
            return ResponseEntity.status(400)
                .body(Map.of("success", false, "errores", List.of("Debe enviar una nota.")));
        }

        int notaVal;
        try {
            notaVal = Integer.parseInt(notaRaw.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400)
                .body(Map.of("success", false, "errores", List.of("La nota debe ser un número entero.")));
        }

        if (notaVal < 1 || notaVal > 7) {
            return ResponseEntity.status(400)
                .body(Map.of("success", false, "errores", List.of("La nota debe ser un entero entre 1 y 7.")));
        }

        Nota nueva = new Nota();
        nueva.setNota(notaVal);
        nueva.setActividad(actOpt.get());
        notaRepo.save(nueva);

        long cantidad = notaRepo.countByActividadId(id);
        Double promedio = notaRepo.calcularPromedio(id);
        double promedioRedondeado = promedio != null
            ? Math.round(promedio * 10.0) / 10.0 : notaVal;

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("cantidadNotas", cantidad);
        resp.put("promedioNota", promedioRedondeado);
        return ResponseEntity.status(201).body(resp);
    }
}
