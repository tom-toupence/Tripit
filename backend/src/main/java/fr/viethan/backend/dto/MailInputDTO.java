package fr.viethan.backend.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MailInputDTO {
    private String name;
    private String email;
    private String message;


}
