package com.raceIQ.authentication.service;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.impl.AuthenticationServiceImpl;

@Service
public class AuthenticationService {
    
    private final AuthenticationServiceImpl authenticationServiceImpl;

    public AuthenticationService(AuthenticationServiceImpl authenticationServiceImpl) {
        this.authenticationServiceImpl = authenticationServiceImpl;
    }

    public boolean login(String username, String password) {
        return authenticationServiceImpl.login(username, password);
    }

    public void register(String username, String password) {
        authenticationServiceImpl.register(username, password);
    }
}
