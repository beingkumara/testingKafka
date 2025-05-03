    package com.raceIQ.authentication.controller;

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
        public String login(@RequestBody AuthRequest request) {
            User user = new User(request.getUsername(), request.getPassword());
            boolean isAuthenticated = authenticationService.login(user);
            if (isAuthenticated) {
                return "Login successful";
            } else {
                return "Invalid username or password";
            }
        }

        @PostMapping("/register")
        public String register(@RequestBody AuthRequest request){
            authenticationService.register(request);
            return "Registration successful";
        }
    }