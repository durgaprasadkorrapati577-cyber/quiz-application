package com.application.QuizApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Enable our custom CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF protection (standard for stateless REST APIs / JWT)
                .csrf(csrf -> csrf.disable())

                // Allow all endpoints without authentication (as you requested)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // For testing & deployment – allows requests from ANY origin
        // This works after deployment on Render / Vercel / Netlify etc.
        config.setAllowedOrigins(List.of("*"));

        // Allow all common HTTP methods (including preflight OPTIONS)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));

        // Allow any header (Authorization, Content-Type, etc.)
        config.setAllowedHeaders(List.of("*"));

        // IMPORTANT: must be false when using wildcard "*"
        config.setAllowCredentials(false);

        // Optional but recommended: expose these headers to frontend if you return JWT later
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // Cache preflight response for 1 hour (reduces OPTIONS requests)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);   // apply to every path

        return source;
    }
}