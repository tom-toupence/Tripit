// AuthServiceImpl.java
package fr.viethan.backend.services;

import fr.viethan.backend.dto.AuthResponseDTO;
import fr.viethan.backend.entities.UserEntity;
import fr.viethan.backend.entities.enums.Role;
import fr.viethan.backend.repositories.UserRepository;
import fr.viethan.backend.interfaces.AuthService;
import fr.viethan.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public AuthServiceImpl(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponseDTO handleOAuthSuccess(String email, String name, String avatarUrl) {
        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity u = new UserEntity();
            u.setEmail(email);
            u.setName(name);
            u.setAvatarUrl(avatarUrl);
            u.setRole(Role.USER);
            u.setPassword("");
            return userRepository.save(u);
        });

        // Si l'utilisateur existe mais que l'info a changé (Google mis à jour)
        if (!name.equals(user.getName()) || !avatarUrl.equals(user.getAvatarUrl())) {
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        }

        String jwt = jwtService.generateToken(user);
        return new AuthResponseDTO(jwt, email, name, avatarUrl, user.getRole().getRoleName());
    }

    @Override
    public AuthResponseDTO getUserStatusFromToken(String token) {
        String email = jwtService.extractUsername(token);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponseDTO(
                token,
                user.getEmail(),
                user.getName(),
                user.getAvatarUrl(),
                user.getRole().getRoleName()
        );
    }
}
