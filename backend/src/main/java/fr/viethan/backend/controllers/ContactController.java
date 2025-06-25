package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.MailInputDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final JavaMailSender mailSender;
    private final String mailSenderUsername;

    @Autowired
    public ContactController(JavaMailSender mailSender, @Value("${spring.mail.from}") String mailSenderUsername) {
        this.mailSender = mailSender;
        this.mailSenderUsername = mailSenderUsername;
    }

    @PostMapping
    public ResponseEntity<?> sendContactEmail(@RequestBody MailInputDTO mailDTO, @Value("${contact.receiver}") String contactReceiver) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setTo(contactReceiver);
            helper.setFrom(mailSenderUsername);
            helper.setSubject("Nouveau mail de contact de la part de " + mailDTO.getName() + " (" + mailDTO.getEmail() + ")");
            helper.setText(buildHtmlContent(mailDTO), true); // true = HTML

            mailSender.send(mimeMessage);
            return ResponseEntity.ok().body("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while sending the email. Please try again later.");
        }
    }

    private String buildHtmlContent(MailInputDTO mailDTO) {
        return """
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fb; padding: 40px;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 14px; box-shadow: 0 6px 32px rgba(0,0,0,0.09); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #4e54c8 0%%, #8f94fb 100%%); color: #fff; padding: 32px 28px 18px 28px;">
                <h2 style="margin: 0; font-weight: 700; font-size: 2em; letter-spacing: 1px;">✉️ Nouveau message TripIt</h2>
                <p style="margin: 10px 0 0 0; font-size: 1em;">Reçu via le formulaire de contact.</p>
            </div>
            <div style="padding: 28px;">
                <div style="margin-bottom: 24px; padding: 16px; background: #f3f5fa; border-radius: 9px;">
                    <strong>Nom :</strong> <span style="color: #2c3e50;">%s</span><br>
                    <strong>Email :</strong> <a href="mailto:%s" style="color: #4e54c8; text-decoration: none;">%s</a>
                </div>
                <div style="margin-bottom: 20px;">
                    <strong style="display: block; margin-bottom: 7px; color: #4e54c8;">💬 Message :</strong>
                    <div style="padding: 16px; background: #f7f9fb; border-radius: 7px; border-left: 4px solid #4e54c8;">
                        %s
                    </div>
                </div>
                <div style="text-align: right; margin-top: 32px;">
                    <a href="mailto:%s" style="background: #4e54c8; color: #fff; padding: 12px 28px; border-radius: 5px; font-weight: 500; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">Répondre</a>
                </div>
            </div>
            <div style="background: #f3f5fa; color: #4e54c8; text-align: center; padding: 14px; font-size: 1em;">
                Formulaire TripIt • <span style="font-size: 1.2em;">🌍</span>
            </div>
        </div>
    </div>
    """.formatted(
                escapeHtml(mailDTO.getName()),
                escapeHtml(mailDTO.getEmail()), escapeHtml(mailDTO.getEmail()),
                escapeHtml(mailDTO.getMessage()).replace("\n", "<br>"),
                escapeHtml(mailDTO.getEmail())
        );
    }

    // Petite fonction pour éviter les injections HTML (sécurité)
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}