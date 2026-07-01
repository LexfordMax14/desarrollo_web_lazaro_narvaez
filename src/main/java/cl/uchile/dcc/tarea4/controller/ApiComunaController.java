package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.Comuna;
import cl.uchile.dcc.tarea4.repository.ComunaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ApiComunaController {

    @Autowired
    private ComunaRepository comunaRepository;

    @GetMapping("/api/comunas")
    @ResponseBody
    Iterable<Comuna> getComunas() {
        return comunaRepository.findAll();
    }
}
