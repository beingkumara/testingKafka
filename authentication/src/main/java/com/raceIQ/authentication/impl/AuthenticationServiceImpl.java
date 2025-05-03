package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;
import com.raceIQ.authentication.models.User;
import com.raceIQ.authentication.repository.UserRepository;

@Service
public class AuthenticationServiceImpl {
    private final UserRepository userRepository;

    public AuthenticationServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public boolean login(String username, String password) {
        // Dummy authentication logic for demonstration purposes
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            System.out.println("Invalid credentials");
            return false;
        }
        System.out.println("Login successful for user: " + username);
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
