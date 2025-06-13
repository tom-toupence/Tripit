package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.AuthDTO;
import fr.viethan.backend.dto.AuthResponseDTO;
import fr.viethan.backend.dto.GoogleTokenDTO;
import fr.viethan.backend.entities.UserEntity;
import fr.viethan.backend.interfaces.AuthService;
import fr.viethan.backend.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
// AuthController.java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.ok().body(Map.of("authenticated", false));
        }
        String token = authorization.substring("Bearer ".length());
        try {
            AuthResponseDTO status = authService.getUserStatusFromToken(token);
            return ResponseEntity.ok().body(Map.of(
                    "authenticated", true,
                    "email", status.getEmail(),
                    "name", status.getName(),
                    "avatarUrl", status.getAvatarUrl(),
                    "role", status.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok().body(Map.of("authenticated", false));
        }
    }
}
