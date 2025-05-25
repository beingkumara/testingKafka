package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.models.AuthRequest;
import com.raceIQ.authentication.models.PasswordResetToken;
import com.raceIQ.authentication.models.User;
import com.raceIQ.authentication.repository.PasswordResetTokenRepository;
import com.raceIQ.authentication.repository.UserRepository;
import com.raceIQ.authentication.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class AuthenticationServiceImpl {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepo;

    private static final String RESET_PASSWORD_URL = "http://localhost:8085/reset-password?token=";

    @Autowired
    private JavaMailSender mailSender;

    public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder,PasswordResetTokenRepository tokenRepo) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepo=tokenRepo;
    }
    
    public ResponseEntity<?> login(User user) {
        try{
            // Try to authenticate with username first
            Authentication auth;
            try {
                auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            } catch (Exception e) {
                // If username authentication fails, try with email
                User userByEmail = userRepository.findByEmail(user.getUsername());
                if (userByEmail == null) {
                    throw new Exception("Invalid username/email or password");
                }
                auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userByEmail.getUsername(), user.getPassword()));
            }
            
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
        // Check if username or email already exists
        User userByUsername = userRepository.findByUsername(request.getUsername());
        User userByEmail = userRepository.findByEmail(request.getEmail());
        
        Map<String,Object> response = new HashMap<>();
        if (userByUsername != null || userByEmail != null) {
            response.put("message", "User already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Create new user with name as username and separate email
        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getEmail());
        userRepository.save(user);
        System.out.println("User registered: " + request.getUsername());
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> forgotPassword(String username){
        User user  = userRepository.findByUsername(username);
        
        if(user == null){
            Map<String,Object> response = new HashMap<>();
            response.put("message ","user not found");
            return ResponseEntity.badRequest().body(response);
        }
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setExpiration(LocalDateTime.now().plusMinutes(10));
        resetToken.setUserId(user.getId());
        tokenRepo.save(resetToken);
        sendResetLink(user, token);
        return ResponseEntity.ok().build();
    }

    private void sendResetLink(User user,String token){
       try{
            String resetLink = RESET_PASSWORD_URL + token;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Reset Password");
            message.setText("Click the link to reset your password: "+resetLink);
            mailSender.send(message);
       } catch(Exception ex){
            System.err.println(ex);
       }
    }

    public ResponseEntity<?> resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = tokenRepo.findByToken(token);
        if(resetToken == null){
            return ResponseEntity.notFound().build();
        }
        Optional<User> optionalUser = userRepository.findById(resetToken.getUserId());
        User user = optionalUser.orElse(null);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        Map<String,Object> response = new HashMap<>();
        response.put("message", "Password Reset Successful");
        return ResponseEntity.ok().body(response);
    }
    
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            String username = authentication.getName();
            User user = userRepository.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            // Create a response that matches the frontend User interface
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getUsername());
            userResponse.put("email", user.getEmail());
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving user: " + e.getMessage());
        }
    }
}