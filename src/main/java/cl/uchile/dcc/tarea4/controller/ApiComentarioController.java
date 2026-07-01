package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.*;
import cl.uchile.dcc.tarea4.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
public class ApiComentarioController {

    private static final int NOMBRE_MIN = 3;
    private static final int NOMBRE_MAX = 80;
    private static final int TEXTO_MIN  = 5;

    private final ActividadRepository actividadRepo;
    private final ComentarioRepository comentarioRepo;

    public ApiComentarioController(ActividadRepository actividadRepo,
                                   ComentarioRepository comentarioRepo) {
        this.actividadRepo  = actividadRepo;
        this.comentarioRepo = comentarioRepo;
    }

    @GetMapping("/api/actividad/{id}/comentarios")
    public ResponseEntity<Map<String, Object>> listar(@PathVariable Integer id) {
        if (actividadRepo.findById(id).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", "Actividad no encontrada"));
        }
        List<Comentario> lista = comentarioRepo.findByActividadIdOrderByFechaDesc(id);
        List<Map<String, Object>> data = lista.stream().map(this::comentarioToMap).toList();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @PostMapping("/api/actividad/{id}/comentarios")
    public ResponseEntity<Map<String, Object>> agregar(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        Optional<Actividad> actOpt = actividadRepo.findById(id);
        if (actOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "errores", List.of("Actividad no encontrada")));
        }

        String nombre = (body.getOrDefault("nombre", "")).strip();
        String texto  = (body.getOrDefault("texto",  "")).strip();

        List<String> errores = new ArrayList<>();
        if (nombre.length() < NOMBRE_MIN || nombre.length() > NOMBRE_MAX)
            errores.add("El nombre debe tener entre " + NOMBRE_MIN + " y " + NOMBRE_MAX + " caracteres.");
        if (texto.length() < TEXTO_MIN)
            errores.add("El comentario debe tener al menos " + TEXTO_MIN + " caracteres.");

        if (!errores.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("success", false, "errores", errores));
        }

        Comentario c = new Comentario();
        c.setNombre(nombre);
        c.setTexto(texto);
        c.setFecha(LocalDateTime.now());
        c.setActividad(actOpt.get());
        c = comentarioRepo.save(c);

        return ResponseEntity.status(201).body(Map.of("success", true, "data", comentarioToMap(c)));
    }

    private Map<String, Object> comentarioToMap(Comentario c) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", c.getId());
        map.put("nombre", c.getNombre());
        map.put("texto", c.getTexto());
        map.put("fecha", c.getFecha());
        return map;
    }
}
