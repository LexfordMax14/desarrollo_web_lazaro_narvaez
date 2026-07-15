package cl.uchile.dcc.tarea4.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        // Usuario administrador: acceso a /admin-fotos y /mensajes-log
        UserDetails cc5002 = User.withUsername("cc5002")
                .password("{noop}examen")
                .roles("ADMIN", "AUDITOR")
                .build();

        // Usuario auditor: acceso solo a /mensajes-log
        UserDetails auditor = User.withUsername("auditor")
                .password("{noop}log-auditor")
                .roles("AUDITOR")
                .build();

        return new InMemoryUserDetailsManager(cc5002, auditor);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin-fotos", "/admin-fotos/", "/admin-fotos.html", "/api/admin-fotos/**")
                    .hasRole("ADMIN")
                .requestMatchers("/mensajes-log", "/mensajes-log/", "/mensajes-log.html", "/api/mensajes-log/**")
                    .hasRole("AUDITOR")
                .anyRequest().permitAll()
            )
            // Se desactiva CSRF para permitir las peticiones AJAX (POST) de la galería.
            .csrf(csrf -> csrf.disable())
            // Autenticación mediante ventana de usuario/contraseña del navegador (HTTP Basic).
            .httpBasic(basic -> {});

        return http.build();
    }
}
