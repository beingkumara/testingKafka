    package com.raceIQ.authentication.controller;

    import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import com.raceIQ.authentication.service.AuthenticationService;
    import com.raceIQ.authentication.models.AuthRequest;
    import com.raceIQ.authentication.models.User;

    @RequestMapping("/api/raceIQ/v1/auth")
    @RestController
    public class AuthenticationController {

        private final AuthenticationService authenticationService;

        public AuthenticationController(AuthenticationService authenticationService) {
            this.authenticationService = authenticationService;
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody AuthRequest request) {
            User user = new User(request.getUsername(), request.getPassword());
           return authenticationService.login(user);
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody AuthRequest request){
            return authenticationService.register(request);
        }
    }