package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.Foto;
import cl.uchile.dcc.tarea4.entity.Log;
import cl.uchile.dcc.tarea4.repository.FotoRepository;
import cl.uchile.dcc.tarea4.repository.LogRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin-fotos")
public class ApiAdminFotosController {

    @PersistenceContext
    private EntityManager em;

    private final FotoRepository fotoRepository;
    private final LogRepository logRepository;

    public ApiAdminFotosController(FotoRepository fotoRepository, LogRepository logRepository) {
        this.fotoRepository = fotoRepository;
        this.logRepository = logRepository;
    }

    /**
     * Devuelve las fotos vigentes (no eliminadas), de la más reciente a la más
     * antigua, junto con la fecha de registro, la comuna y el email del miembro
     * que informó la actividad.
     */
    @GetMapping("/lista")
    public List<Map<String, Object>> lista() {
        List<?> rows = em.createQuery(
            "SELECT f.id, f.rutaArchivo, f.nombreArchivo, " +
            "       m.fechaRegistro, c.nombre, m.email " +
            "FROM Foto f " +
            "JOIN f.actividad a JOIN a.miembro m JOIN m.comuna c " +
            "WHERE f.eliminada = false " +
            "ORDER BY f.id DESC"
        ).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] r = (Object[]) row;
            Map<String, Object> foto = new HashMap<>();
            foto.put("id", r[0]);
            foto.put("rutaArchivo", r[1]);
            foto.put("nombreArchivo", r[2]);
            foto.put("fechaRegistro", r[3] != null ? r[3].toString() : null);
            foto.put("comuna", r[4]);
            foto.put("email", r[5]);
            result.add(foto);
        }
        return result;
    }

    /**
     * Marca una foto como eliminada y deja el registro correspondiente en la
     * tabla log. El motivo es obligatorio (largo mínimo 5, máximo 200).
     */
    @PostMapping("/eliminar")
    @Transactional
    public ResponseEntity<?> eliminar(@RequestBody Map<String, Object> body) {
        Object idObj = body.get("id");
        Object motivoObj = body.get("motivo");

        if (idObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falta el id de la foto"));
        }
        String motivo = motivoObj != null ? motivoObj.toString().trim() : "";
        if (motivo.length() < 5 || motivo.length() > 200) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El motivo debe tener entre 5 y 200 caracteres"));
        }

        Integer id = Integer.valueOf(idObj.toString());
        Optional<Foto> optional = fotoRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Foto foto = optional.get();
        foto.setEliminada(true);
        fotoRepository.save(foto);

        String mensaje = "eliminado foto " + id + " por usuario admin, motivo: " + motivo;
        logRepository.save(new Log(mensaje));

        return ResponseEntity.ok(Map.of("ok", true, "id", id));
    }
}
