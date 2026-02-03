package com.application.QuizApp.controller;

import com.application.QuizApp.model.WeeklyContest;
import com.application.QuizApp.service.WeeklyContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/weekly-contests")
public class WeeklyContestController {

    @Autowired
     WeeklyContestService contestService;


    // Create weekly contest (admin later)
    @PostMapping("/create")
    public WeeklyContest createContest(@RequestBody WeeklyContest contest) {
        System.out.println("REQUEST RECEIVED  " + contest);
        return contestService.createContest(contest);
    }

    // Get all active weekly contests
    @GetMapping("/active")
    public List<WeeklyContest> getActiveContests() {
        return contestService.getActiveContests();
    }

    // Get contest by id
    @GetMapping("/{id}")
    public WeeklyContest getContest(@PathVariable Integer id) {
        return contestService.getContestById(id);
    }
}
