package fr.viethan.backend.services;

import fr.viethan.backend.dto.AuthDTO;
import fr.viethan.backend.dto.AuthResponseDTO;
import fr.viethan.backend.entities.UserEntity;
import fr.viethan.backend.entities.enums.Role;
import fr.viethan.backend.repositories.UserRepository;
import fr.viethan.backend.interfaces.AuthService;
import fr.viethan.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDTO authenticate(AuthDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid credentials");
        }

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, user.getRole().getRoleName());
    }

    @Override
    public AuthResponseDTO register(AuthDTO request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        System.out.println("Registering user: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());

        // Create user
        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);

        // Génère le token
        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, user.getEmail(), user.getRole().getRoleName());
    }

}
