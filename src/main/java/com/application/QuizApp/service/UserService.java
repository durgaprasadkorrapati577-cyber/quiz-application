package com.application.QuizApp.service;

import com.application.QuizApp.DAO.UserDAO;
import com.application.QuizApp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

     @Autowired
    UserDAO userDAO;

    public User register(User user) {
        return userDAO.save(user);
    }

    public boolean login(String email, String password) {
        Optional<User> userOpt = userDAO.findByEmail(email);
//        Optional<User> userOpt1 = userDAO.findByUsername(email);
//        if (userOpt1.isPresent()) {
//            return userOpt1.get().getPassword().equals(password);
//        }

        if (userOpt.isPresent()) {
            return userOpt.get().getPassword().equals(password);
        }
        return false;
    }

}
