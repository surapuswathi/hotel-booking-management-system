package com.hotelbooking.config;

import com.hotelbooking.security.CustomUserDetailsService;
import com.hotelbooking.security.JwtAuthenticationEntryPoint;
import com.hotelbooking.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    // JWT Authentication Filter
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    // Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication Provider
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    // Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {

        return authConfig.getAuthenticationManager();
    }

    // Security Configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
            // Enable CORS
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF for the REST API
            .csrf(csrf -> csrf.disable())

            // Handle unauthorized requests
            .exceptionHandling(exception ->
                    exception.authenticationEntryPoint(unauthorizedHandler))

            // JWT-based authentication is stateless
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public hotel, room and room-type GET endpoints
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/hotels/**",
                        "/api/rooms/**",
                        "/api/room-types/**"
                ).permitAll()

                // Swagger/OpenAPI endpoints
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                // Admin endpoints
                .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                // Hotel owner endpoints
                .requestMatchers("/api/owner/**")
                        .hasAnyRole("HOTEL_OWNER", "ADMIN")

                // Customer endpoints
                .requestMatchers("/api/customer/**")
                        .hasAnyRole("CUSTOMER", "ADMIN", "HOTEL_OWNER")

                // Booking and payment endpoints require authentication
                .requestMatchers(
                        "/api/bookings/**",
                        "/api/payments/**"
                ).authenticated()

                // All remaining endpoints require authentication
                .anyRequest().authenticated()
            );

        // Register authentication provider
        http.authenticationProvider(authenticationProvider());

        // Add JWT filter
        http.addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Local development and deployed Vercel frontend
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "https://hotel-booking-management-system-omega.vercel.app"
        ));

        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));

        // Allow request headers, including Authorization
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials
        configuration.setAllowCredentials(true);

        // Apply CORS to all endpoints
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}