package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.AuthDTO;
import fr.viethan.backend.interfaces.AuthService;
import fr.viethan.backend.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDTO registerRequest) {
        try {
            return ResponseEntity.ok(authService.register(registerRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO request) {
        try {
            return ResponseEntity.ok(authService.authenticate(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Authorization header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }
        String token = authHeader.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtService.getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return ResponseEntity.ok(claims);
    }
}
