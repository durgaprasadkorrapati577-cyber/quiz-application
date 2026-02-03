package com.application.QuizApp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "leaderboard")
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which contest
    private Long contestId;

    // which user
    private Long userId;

    private int score;

    private int rank;

    private LocalDateTime submittedAt;

}
