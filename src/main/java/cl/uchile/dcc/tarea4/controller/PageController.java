package cl.uchile.dcc.tarea4.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Expone las URLs "amigables" solicitadas en el enunciado y las redirige
 * (forward) hacia los archivos HTML estáticos correspondientes. La seguridad
 * se aplica sobre estas rutas en {@code SecurityConfig}.
 */
@Controller
public class PageController {

    @GetMapping({"/admin-fotos", "/admin-fotos/"})
    public String adminFotos() {
        return "forward:/admin-fotos.html";
    }

    @GetMapping({"/mensajes-log", "/mensajes-log/"})
    public String mensajesLog() {
        return "forward:/mensajes-log.html";
    }

    @GetMapping({"/estadistica-fotos", "/estadistica-fotos/"})
    public String estadisticaFotos() {
        return "forward:/estadistica-fotos.html";
    }
}
