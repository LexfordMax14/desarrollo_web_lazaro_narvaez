package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.entity.*;
import cl.uchile.dcc.tarea4.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
public class ApiMiembroController {

    private final MiembroRepository miembroRepo;
    private final ComunaRepository comunaRepo;
    private final ActividadRepository actividadRepo;
    private final FotoRepository fotoRepo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ApiMiembroController(MiembroRepository miembroRepo,
                                ComunaRepository comunaRepo,
                                ActividadRepository actividadRepo,
                                FotoRepository fotoRepo) {
        this.miembroRepo  = miembroRepo;
        this.comunaRepo   = comunaRepo;
        this.actividadRepo = actividadRepo;
        this.fotoRepo     = fotoRepo;
    }

    @GetMapping("/api/miembros")
    public Map<String, Object> listarMiembros(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("fechaRegistro").descending());
        Page<Miembro> result = miembroRepo.findAll(pageable);

        List<Map<String, Object>> data = new ArrayList<>();
        for (Miembro m : result.getContent()) {
            data.add(miembroToMap(m));
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("total", result.getTotalElements());
        resp.put("page", page);
        resp.put("limit", limit);
        resp.put("data", data);
        return resp;
    }

    @GetMapping("/api/miembro/{id}")
    public ResponseEntity<Map<String, Object>> detalleMiembro(@PathVariable Integer id) {
        Optional<Miembro> opt = miembroRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", "Miembro no encontrado"));
        }
        Miembro m = opt.get();

        Map<String, Object> miembroData = miembroToMap(m);

        if (m.getComuna() != null) {
            miembroData.put("comuna", Map.of(
                "id", m.getComuna().getId(),
                "nombre", m.getComuna().getNombre()
            ));
        } else {
            miembroData.put("comuna", null);
        }

        List<Map<String, Object>> actividades = new ArrayList<>();
        if (m.getActividades() != null) {
            for (Actividad a : m.getActividades()) {
                actividades.add(actividadToMap(a));
            }
        }
        miembroData.put("actividades", actividades);

        return ResponseEntity.ok(Map.of("success", true, "data", miembroData));
    }

    @PostMapping("/api/miembros")
    public ResponseEntity<Map<String, Object>> registrar(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String telefono,
            @RequestParam Integer comunaId,
            @RequestParam(value = "nombre_actividad[]", required = false) List<String> nombresActividad,
            @RequestParam(value = "descripcion[]",      required = false) List<String> descripciones,
            @RequestParam(value = "tipo[]",             required = false) List<String> tipos,
            @RequestParam(value = "dia[]",              required = false) List<String> dias,
            @RequestParam(value = "hora_inicio[]",      required = false) List<String> horasInicio,
            @RequestParam(value = "duracion[]",         required = false) List<String> duraciones,
            @RequestParam(value = "archivo[]",          required = false) List<MultipartFile> archivos) {

        List<String> errores = new ArrayList<>();

        if (nombre == null || nombre.strip().length() < 2)
            errores.add("El nombre debe tener al menos 2 caracteres.");
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            errores.add("Email inválido.");
        if (telefono == null || !telefono.matches("^9\\d{8}$"))
            errores.add("Teléfono inválido (debe ser 9XXXXXXXX).");
        if (comunaId == null || comunaRepo.findById(comunaId).isEmpty())
            errores.add("Debe seleccionar una comuna válida.");

        if (nombresActividad == null || nombresActividad.isEmpty())
            errores.add("Debe agregar al menos una actividad.");

        if (nombresActividad != null) {
            for (int i = 0; i < nombresActividad.size(); i++) {
                String nomAct = nombresActividad.get(i).strip();
                if (nomAct.length() < 2)
                    errores.add("Actividad " + (i+1) + ": el nombre debe tener al menos 2 caracteres.");
                if (tipos == null || i >= tipos.size() || tipos.get(i).isBlank())
                    errores.add("Actividad " + (i+1) + ": debe seleccionar un tipo.");
                if (dias == null || i >= dias.size() || dias.get(i).isBlank())
                    errores.add("Actividad " + (i+1) + ": debe seleccionar un día.");
                if (horasInicio == null || i >= horasInicio.size() || horasInicio.get(i).isBlank())
                    errores.add("Actividad " + (i+1) + ": debe ingresar la hora de inicio.");
                if (duraciones == null || i >= duraciones.size() || duraciones.get(i).isBlank())
                    errores.add("Actividad " + (i+1) + ": debe ingresar la duración.");
                if (archivos != null && i < archivos.size() && !archivos.get(i).isEmpty()) {
                    String fname = archivos.get(i).getOriginalFilename();
                    if (fname != null && !fname.matches("(?i).*\\.(jpg|jpeg|png)$"))
                        errores.add("Actividad " + (i+1) + ": extensión no permitida (jpg, jpeg, png).");
                }
            }
        }

        if (!errores.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("success", false, "errores", errores));
        }

        Miembro miembro = new Miembro();
        miembro.setNombre(nombre.strip());
        miembro.setEmail(email.strip());
        miembro.setTelefono(telefono.strip());
        miembro.setFechaRegistro(LocalDateTime.now());
        miembro.setComuna(comunaRepo.findById(comunaId).get());
        miembro = miembroRepo.save(miembro);

        Path uploadPath = Paths.get(uploadDir);
        try { Files.createDirectories(uploadPath); } catch (IOException ignored) {}

        for (int i = 0; i < nombresActividad.size(); i++) {
            Actividad act = new Actividad();
            act.setNombre(nombresActividad.get(i).strip());
            act.setDescripcion(descripciones != null && i < descripciones.size()
                ? descripciones.get(i) : "");
            act.setTipo(tipos.get(i));
            act.setDia(dias.get(i));
            act.setHoraInicio(horasInicio.get(i));
            act.setDuracion(duraciones.get(i));
            act.setMiembro(miembro);
            act = actividadRepo.save(act);

            if (archivos != null && i < archivos.size() && !archivos.get(i).isEmpty()) {
                MultipartFile file = archivos.get(i);
                String originalName = file.getOriginalFilename();
                String savedName = UUID.randomUUID() + "_" + originalName;
                try {
                    Files.copy(file.getInputStream(), uploadPath.resolve(savedName),
                               StandardCopyOption.REPLACE_EXISTING);
                    Foto foto = new Foto();
                    foto.setRutaArchivo("static/uploads/" + savedName);
                    foto.setNombreArchivo(originalName);
                    foto.setActividad(act);
                    fotoRepo.save(foto);
                } catch (IOException e) {
                    errores.add("Error al guardar el archivo de la actividad " + (i+1) + ".");
                }
            }
        }

        return ResponseEntity.status(201).body(
            Map.of("success", true, "mensaje", "Registro exitoso.", "id", miembro.getId())
        );
    }

    private Map<String, Object> miembroToMap(Miembro m) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", m.getId());
        map.put("nombre", m.getNombre());
        map.put("email", m.getEmail());
        map.put("telefono", m.getTelefono());
        map.put("fecha_registro", m.getFechaRegistro());
        map.put("comuna_id", m.getComuna() != null ? m.getComuna().getId() : null);
        return map;
    }

    private Map<String, Object> actividadToMap(Actividad a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", a.getId());
        map.put("nombre", a.getNombre());
        map.put("dia", a.getDia());
        map.put("hora_inicio", a.getHoraInicio());
        map.put("duracion", a.getDuracion());
        map.put("tipo", a.getTipo());
        map.put("descripcion", a.getDescripcion());

        List<Map<String, Object>> fotos = new ArrayList<>();
        if (a.getFotos() != null) {
            for (Foto f : a.getFotos()) {
                fotos.add(Map.of(
                    "id", f.getId(),
                    "nombre_archivo", f.getNombreArchivo(),
                    "ruta_archivo", f.getRutaArchivo()
                ));
            }
        }
        map.put("fotos", fotos);
        return map;
    }
}
