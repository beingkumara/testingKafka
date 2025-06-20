package com.raceIQ.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import com.raceIQ.authentication.service.AuthenticationService;
import com.f1nity.library.models.authentication.AuthRequest;
import com.f1nity.library.models.authentication.User;

@RequestMapping("/api/f1nity/v1/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Frontend sends email as username for login
        User user = new User(request.getUsername(), request.getPassword());
        return authenticationService.login(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request){
        return authenticationService.register(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request){
       return authenticationService.forgotPassword(request.get("email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword( @RequestParam String token,
    @RequestParam String newPassword){
        return authenticationService.resetPassword(token,newPassword);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        return authenticationService.getCurrentUser();
    }

    @GetMapping("/edit-profile")
    public ResponseEntity<?> editProfile(@RequestBody User user) {
        return authenticationService.editProfile(user);
    }

    @GetMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String token){
        return authenticationService.verifyOtp(token);
    }
    
}