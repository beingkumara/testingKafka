package com.raceIQ.authentication.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.raceIQ.authentication.service.AuthenticationService;
import com.raceIQ.authentication.models.LoginRequest;

@RequestMapping("/api/raceIQ/v1/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        boolean isAuthenticated = authenticationService.login(request.getUsername(), request.getPassword());
        if (isAuthenticated) {
            return "Login successful";
        } else {
            return "Invalid username or password";
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody LoginRequest request){
        authenticationService.register(request.getUsername(), request.getPassword());
        return "Registration successful";
    }
}