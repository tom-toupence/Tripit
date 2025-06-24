package fr.viethan.backend.controllers;

import fr.viethan.backend.dto.MailInputDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final JavaMailSender mailSender;

    @Autowired
    public ContactController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<?> sendContactEmail(@RequestBody MailInputDTO mailDTO, @Value("${contact.receiver}") String contactReceiver) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(contactReceiver);
            message.setSubject("Nouveau mail de contact de la part de " + mailDTO.getName() + " (" + mailDTO.getEmail() + ")");
            StringBuilder sb = new StringBuilder();
            sb.append("👋 Nouvelle demande de contact reçue !\n\n");
            sb.append("╔════════════════════════════╗\n");
            sb.append("  Nom         : ").append(mailDTO.getName()).append("\n");
            sb.append("  Email       : ").append(mailDTO.getEmail()).append("\n");
            sb.append("╚════════════════════════════╝\n\n");
            sb.append("💬 Message :\n");
            sb.append("----------------------------------------\n");
            sb.append(mailDTO.getMessage()).append("\n");
            sb.append("----------------------------------------\n\n");
            sb.append("📬 Pour répondre, utilisez : ").append(mailDTO.getEmail()).append("\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("\nFormulaire de contact TripIt");

            message.setText(sb.toString());
            mailSender.send(message);
            return ResponseEntity.ok().body("Email sent successfully");
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}