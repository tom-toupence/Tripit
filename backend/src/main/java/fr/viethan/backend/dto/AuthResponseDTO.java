package fr.viethan.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String email;
    private String role;

    public AuthResponseDTO(String token, String role) {
        this.token = token;
        this.role = role;
    }
}
