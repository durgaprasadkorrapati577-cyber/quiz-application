package com.application.QuizApp.DAO;

import com.application.QuizApp.model.WeeklyContest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyContestDAO extends JpaRepository<WeeklyContest, Integer> {

    List<WeeklyContest> findByActiveTrue();
}
