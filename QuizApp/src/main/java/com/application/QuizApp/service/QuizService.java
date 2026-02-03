package com.application.QuizApp.service;

import com.application.QuizApp.DAO.QuestionDao;
import com.application.QuizApp.DAO.QuizDAO;
import com.application.QuizApp.model.Question;
import com.application.QuizApp.model.QuestionWrapper;
import com.application.QuizApp.model.Quiz;
import com.application.QuizApp.model.Response;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequestMapping("/quiz")
public class QuizService {

    @Autowired
    QuizDAO quizDAO;

    @Autowired
    QuestionDao questionDao;


    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        List<Question> questions = questionDao.findRandomQuestionsByCategory(category, numQ);
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quizDAO.save(quiz);
        return new ResponseEntity<>("Quiz created successfully", HttpStatus.CREATED);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuiz(Integer quizId) {
        Optional<Quiz> quiz = quizDAO.findById(quizId);
        List<Question> questionsFromDb = quiz.get().getQuestions();
        List<QuestionWrapper> questionForUser = new ArrayList<>();
        for (Question q : questionsFromDb) {
            QuestionWrapper qw = new QuestionWrapper(q.getId(), q.getQuestion_title(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4());
            questionForUser.add(qw);
        }
        return new ResponseEntity<>(questionForUser, HttpStatus.OK);

    }


    public ResponseEntity<Integer> calculateResults(
            Integer quizId,
            List<Response> responses) {

        Quiz quiz = quizDAO.findById(quizId).get();
        List<Question> questions = quiz.getQuestions();

        int score = 0;

        for (Response response : responses) {

            for (Question question : questions) {

                if (question.getId().equals(response.getId())) {

                    if (response.getResponse().trim()
                            .equalsIgnoreCase(question.getRight_answer().trim())) {
                        score++;
                    }
                    break;
                }
            }
        }

        return new ResponseEntity<>(score, HttpStatus.OK);
    }

}
