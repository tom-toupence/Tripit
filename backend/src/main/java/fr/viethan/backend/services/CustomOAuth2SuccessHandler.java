package fr.viethan.backend.services;

import fr.viethan.backend.dto.AuthResponseDTO;
import fr.viethan.backend.interfaces.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Autowired
    public CustomOAuth2SuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        DefaultOidcUser oidcUser = (DefaultOidcUser) authentication.getPrincipal();
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String avatarUrl = oidcUser.getPicture();

        AuthResponseDTO auth = authService.handleOAuthSuccess(email, name, avatarUrl);

        // Redirection sur le front avec le JWT en paramètre
        response.sendRedirect("http://localhost:3000/auth/callback?token=" + auth.getToken());
    }
}
