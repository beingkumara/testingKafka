package com.raceIQ.authentication.service;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.impl.AuthenticationServiceImpl;
import com.raceIQ.authentication.models.User;

@Service
public class AuthenticationService {
    
    private final AuthenticationServiceImpl authenticationServiceImpl;

    public AuthenticationService(AuthenticationServiceImpl authenticationServiceImpl) {
        this.authenticationServiceImpl = authenticationServiceImpl;
    }

    public boolean login(User user) {
        return authenticationServiceImpl.login(user);
    }

    public void register(String username, String password) {
        authenticationServiceImpl.register(username, password);
    }
}
