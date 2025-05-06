package com.raceIQ.authentication.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.raceIQ.authentication.impl.AuthenticationServiceImpl;
import com.raceIQ.authentication.models.AuthRequest;
import com.raceIQ.authentication.models.User;

@Service
public class AuthenticationService {
    
    private final AuthenticationServiceImpl authenticationServiceImpl;

    public AuthenticationService(AuthenticationServiceImpl authenticationServiceImpl) {
        this.authenticationServiceImpl = authenticationServiceImpl;
    }

    public ResponseEntity<?> login(User user) {
        return authenticationServiceImpl.login(user);
    }

    public ResponseEntity<?> register(AuthRequest authRequest) {
        return authenticationServiceImpl.register(authRequest);
    }

    public ResponseEntity<?> forgotPassword(String username){
        return authenticationServiceImpl.forgotPassword(username);
    }

    public ResponseEntity<?> resetPassword(String token, String newPassword){
        return authenticationServiceImpl.resetPassword(token,newPassword);
    }
}
