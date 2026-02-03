package com.application.QuizApp.service;

import com.application.QuizApp.DAO.LeaderboardDAO;
import com.application.QuizApp.model.Leaderboard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
     LeaderboardDAO leaderboardDAO;



    // Get leaderboard (rank calculated here)
    public List<Leaderboard> getLeaderboard(Long contestId) {

        List<Leaderboard> list =
                leaderboardDAO.findByContestIdOrderByScoreDesc(contestId);

        int rank = 1;
        for (Leaderboard l : list) {
            l.setRank(rank++);
        }

        return list;
    }
}
