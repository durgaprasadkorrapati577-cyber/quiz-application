package com.application.QuizApp.service;

import com.application.QuizApp.DAO.WeeklyContestDAO;
import com.application.QuizApp.model.WeeklyContest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeeklyContestService {


    @Autowired
    WeeklyContestDAO contestDAO;

    public WeeklyContest createContest(WeeklyContest contest) {
        contest.setActive(true);
        return contestDAO.save(contest);
    }

    public List<WeeklyContest> getActiveContests() {
        return contestDAO.findByActiveTrue();
    }

    public WeeklyContest getContestById(Integer id) {
        return contestDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
    }
}
