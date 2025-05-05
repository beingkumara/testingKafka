package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.models.AuthRequest;
import com.raceIQ.authentication.models.User;
import com.raceIQ.authentication.repository.UserRepository;
import com.raceIQ.authentication.security.JwtTokenProvider;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthenticationServiceImpl {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;


    public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public ResponseEntity<?> login(User user) {
        try{
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            System.out.println("Login successful for user: " + userDetails.getUsername());
            Map<String,Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message","Login Success");
            return ResponseEntity.ok(response);
        } catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        
    }

    public ResponseEntity<?> register(AuthRequest request) {
        // Dummy registration logic for demonstration purposes
        User user = userRepository.findByUsername(request.getUsername());
        Map<String,Object> response = new HashMap<>();
        if (user != null) {
            response.put("message", "User already exists");
            return ResponseEntity.badRequest().body(response);
        }
        user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getEmail());
        userRepository.save(user);
        System.out.println("User registered: " + request.getUsername());
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
    }
}
