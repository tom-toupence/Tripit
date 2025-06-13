package fr.viethan.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import fr.viethan.backend.entities.enums.Role;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Column
    private String avatarUrl;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
