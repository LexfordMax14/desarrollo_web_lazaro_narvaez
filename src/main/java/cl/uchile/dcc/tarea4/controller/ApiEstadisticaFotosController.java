package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.repository.FotoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/estadistica-fotos")
public class ApiEstadisticaFotosController {

    private final FotoRepository fotoRepository;

    public ApiEstadisticaFotosController(FotoRepository fotoRepository) {
        this.fotoRepository = fotoRepository;
    }

    /**
     * Entrega el total de fotos vigentes y el total de fotos eliminadas.
     * Endpoint de acceso público.
     */
    @GetMapping("/datos")
    public Map<String, Object> datos() {
        long vigentes = fotoRepository.countByEliminadaFalse();
        long eliminadas = fotoRepository.countByEliminadaTrue();
        return Map.of("vigentes", vigentes, "eliminadas", eliminadas);
    }
}
