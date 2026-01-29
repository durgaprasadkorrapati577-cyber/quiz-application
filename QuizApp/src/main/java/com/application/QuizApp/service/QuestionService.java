package com.application.QuizApp.service;

import com.application.QuizApp.DAO.QuestionDao;
import com.application.QuizApp.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    QuestionDao questionDao;

    public  List<Question> getQuestionsByCategory(String category) {
        return questionDao.findByCategory(category);
    }

    public List<Question> getAllQuestions() {
           return questionDao.findAll();
    }

    public String addQuestion(Question question) {
        questionDao.save(question);
        return "Question added successfully";
    }
}
