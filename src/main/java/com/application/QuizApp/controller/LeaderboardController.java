package com.application.QuizApp.controller;

import com.application.QuizApp.model.Leaderboard;
import com.application.QuizApp.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    @Autowired
     LeaderboardService leaderboardService;




    // Get leaderboard for a contest
    @GetMapping("/{contestId}")
    public List<Leaderboard> getLeaderboard(@PathVariable Long contestId) {
        return leaderboardService.getLeaderboard(contestId);
    }
}
