package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.models.AuthRequest;
import com.raceIQ.authentication.models.User;
import com.raceIQ.authentication.repository.UserRepository;
import com.raceIQ.authentication.security.JwtTokenProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@Service
public class AuthenticationServiceImpl {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;


    public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }
    public boolean login(User user) {
        // Dummy authentication logic for demonstration purposes
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        String token = jwtTokenProvider.generateToken(user);
        return true;
    }

    public void register(AuthRequest request) {
        // Dummy registration logic for demonstration purposes
        User user = userRepository.findByUsername(request.getUsername());
        if (user != null) {
            System.out.println("User already exists: " + request.getUsername());
            return;
        }
        user = new User(request.getUsername(), request.getPassword(),request.getEmail());
        userRepository.save(user);
        System.out.println("User registered: " + request.getUsername());
    }
}
