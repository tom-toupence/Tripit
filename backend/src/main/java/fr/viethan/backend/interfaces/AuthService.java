package fr.viethan.backend.interfaces;

import fr.viethan.backend.dto.AuthDTO;
import fr.viethan.backend.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO handleOAuthSuccess(String email, String name, String avatarUrl);
    AuthResponseDTO getUserStatusFromToken(String token);
}
