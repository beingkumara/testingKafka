package com.f1nity.authentication.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.f1nity.authentication.impl.AuthenticationServiceImpl;
import com.f1nity.library.models.authentication.AuthRequest;
import com.f1nity.library.models.authentication.User;

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
    
    public ResponseEntity<?> getCurrentUser() {
        return authenticationServiceImpl.getCurrentUser();
    }

    public ResponseEntity<?> editProfile(User user) {
        return authenticationServiceImpl.editProfile(user);
    }

    public ResponseEntity<?> verifyOtp(String token){
        return authenticationServiceImpl.verifyOtp(token);
    }
}
