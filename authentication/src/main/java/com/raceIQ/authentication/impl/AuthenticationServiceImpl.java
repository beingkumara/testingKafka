package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;
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

    public void register(String username, String password) {
        // Dummy registration logic for demonstration purposes
        User user = userRepository.findByUsername(username);
        if (user != null) {
            System.out.println("User already exists: " + username);
            return;
        }
        user = new User();
        user.setUsername(username);
        user.setPassword(password);
        userRepository.save(user);
        System.out.println("User registered: " + username);
    }
}
