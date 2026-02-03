package com.application.QuizApp.controller;

import com.application.QuizApp.model.Question;
import com.application.QuizApp.model.QuestionWrapper;
import com.application.QuizApp.model.Response;
import com.application.QuizApp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestParam String category,@RequestParam  int numQ,
                                             @RequestParam String title) {
        return quizService.createQuiz(category, numQ, title);
    }

    @GetMapping("/get/{quizId}")
    public ResponseEntity<List<QuestionWrapper>> getQuiz(@PathVariable Integer quizId) {
        return quizService.getQuiz(quizId);
    }

    @PostMapping("/submit/{quizId}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer quizId, @RequestBody List<Response> responses) {
        return quizService.calculateResults(quizId, responses);
    }


}
