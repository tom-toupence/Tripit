package fr.viethan.backend.interfaces;

import fr.viethan.backend.dto.AuthDTO;
import fr.viethan.backend.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO authenticate(AuthDTO authDTO);
    AuthResponseDTO register(AuthDTO authDTO);
}
