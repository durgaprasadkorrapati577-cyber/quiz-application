package com.application.QuizApp.DAO;

import com.application.QuizApp.model.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardDAO extends JpaRepository<Leaderboard, Long> {

    List<Leaderboard> findByContestIdOrderByScoreDesc(Long contestId);
}
