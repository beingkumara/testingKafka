package com.f1nity.authentication.controller;

import com.f1nity.library.models.authentication.User;
import com.f1nity.authentication.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import com.f1nity.library.models.authentication.AuthRequest;

@RequestMapping("/api/fanf1x/v1/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Frontend sends email as username for login
        User user = new User(request.getEmail(), request.getPassword());
        return authenticationService.login(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        return authenticationService.forgotPassword(request.get("email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
            @RequestParam String newPassword) {
        return authenticationService.resetPassword(token, newPassword);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        return authenticationService.getCurrentUser();
    }

    @GetMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String token) {
        return authenticationService.verifyOtp(token);
    }

    @GetMapping("/user/{emailId}")
    public User getUserByEmail(@PathVariable String emailId) {
        User user = authenticationService.getUserByEmail(emailId);
        if (user == null) {
            return null;
        }
        return user;
    }

    @PutMapping("/user/{emailId}")
    public User updateUser(@RequestBody User user) {
        return authenticationService.updateUser(user);
    }

}