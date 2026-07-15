package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.Log;
import cl.uchile.dcc.tarea4.repository.LogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mensajes-log")
public class ApiMensajesLogController {

    private final LogRepository logRepository;

    public ApiMensajesLogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    /**
     * Devuelve todo el contenido de la tabla log (id, fecha y mensaje),
     * de la más reciente a la más antigua.
     */
    @GetMapping("/lista")
    public List<Map<String, Object>> lista() {
        List<Log> logs = logRepository.findAllByOrderByFechaDescIdDesc();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Log log : logs) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("id", log.getId());
            fila.put("fecha", log.getFecha() != null ? log.getFecha().toString() : null);
            fila.put("mensaje", log.getMensaje());
            result.add(fila);
        }
        return result;
    }
}
