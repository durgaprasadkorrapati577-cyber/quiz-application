package com.application.QuizApp.model;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Data
@Table(name = "users")
@Entity
@RequiredArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String email;
    private String password;

    private LocalDateTime createdAt = LocalDateTime.now();
}
