package com.application.QuizApp.controller;


import com.application.QuizApp.model.User;
import com.application.QuizApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> SignUp(@RequestBody User user) {
        User saveUser= userService.register(user);
        return new ResponseEntity<>(saveUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        boolean success = userService.login(email, password);
        return  new ResponseEntity<>(success ? "Login successful" : "Invalid credentials", success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED);

//        if (success) {
//            return ResponseEntity.ok("Login successful");
//        } else {
//            return ResponseEntity.status(401).body("Invalid credentials");
//        }
    }

}
