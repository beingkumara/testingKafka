package com.raceIQ.authentication.impl;

import org.springframework.stereotype.Service;

import com.raceIQ.authentication.models.AuthRequest;
import com.raceIQ.authentication.models.PasswordResetToken;
import com.raceIQ.authentication.models.User;
import com.raceIQ.authentication.repository.PasswordResetTokenRepository;
import com.raceIQ.authentication.repository.UserRepository;
import com.raceIQ.authentication.security.JwtTokenProvider;
import com.raceIQ.authentication.utils.AuthenticationUtil;
import com.raceIQ.authentication.utils.SecureOTPGenerator;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;

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
    private final AuthenticationUtil authenticationUtil;
    private final SecureOTPGenerator otpGenerator;

    private static final String RESET_PASSWORD_URL = "http://localhost:8085/reset-password?token=";

    @Autowired
    private JavaMailSender mailSender;

    public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder,PasswordResetTokenRepository tokenRepo, AuthenticationUtil authenticationUtil, SecureOTPGenerator otpGenerator) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepo=tokenRepo;
        this.authenticationUtil = authenticationUtil;
        this.otpGenerator = otpGenerator;
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
        
        if(!authenticationUtil.isValidEmailAddress(request.getEmail())){
            response.put("message","Invalid Email Address. Please enter a valid email address");
            return ResponseEntity.badRequest().body(response);
        }

        if(!authenticationUtil.isValidPassword(request.getPassword())){
            response.put("message","Invalid Password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return ResponseEntity.badRequest().body(response);
        }
        // Create new user with name as username and separate email
        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getEmail());
        userRepository.save(user);
        System.out.println("User registered: " + request.getUsername());
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> forgotPassword(String email) {
        // Validate email input
        if (email == null || email.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email address is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Find user by email
        User user = userRepository.findByEmail(email.trim());
        
        // Always return success to prevent email enumeration attacks
        if (user == null) {
            // Log the attempt but don't reveal that the email doesn't exist
            System.out.println("Password reset requested for non-existent email: " + email);
            return ResponseEntity.ok().body(Collections.singletonMap("message", "If an account with this email exists, a password reset OTP has been sent"));
        }
        
        try {
            // Generate OTP
            String otp = otpGenerator.generateSecureOTP();
            
            // Delete any existing OTP tokens for this user
            tokenRepo.deleteAllByUserId(user.getId());
            
            // Create and save new OTP token
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(otp);
            resetToken.setExpiration(LocalDateTime.now().plusMinutes(10)); // OTP valid for 10 minutes
            resetToken.setUserId(user.getId());
            tokenRepo.save(resetToken);
            
            // Send OTP via email
            sendResetLink(user, otp);
            
            // Log the action
            System.out.println("Password reset OTP sent to: " + user.getEmail());
            
            // Return success response
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
                "If an account with this email exists, a password reset OTP has been sent"));
                
        } catch (Exception e) {
            // Log the error
            System.err.println("Error processing password reset request: " + e.getMessage());
            e.printStackTrace();
            
            // Return a generic error message
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "An error occurred while processing your request. Please try again later.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    private void sendResetLink(User user, String otp) throws Exception {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your Password Reset OTP");
        
        // Create a more user-friendly email message
        String emailText = String.format(
            "Hello %s,\n\n" +
            "You recently requested to reset your password. Use the following One-Time Password (OTP) to reset your password.\n\n" +
            "Your OTP is: %s\n\n" +
            "This OTP will expire in 10 minutes.\n\n" +
            "If you didn't request this, please ignore this email or contact support if you have any concerns.\n\n" +
            "Thanks,\nThe Support Team",
            user.getUsername(), // Or user's first name if available
            otp
        );
        
        message.setText(emailText);
        
        // Send the email
        mailSender.send(message);
        
        // Log that the email was sent (without logging the OTP)
        System.out.println("Password reset OTP email sent to: " + user.getEmail());
    }

    public ResponseEntity<?> resetPassword(String resetToken, String newPassword) {
        // Validate input parameters
        System.out.println("Reset token: " + resetToken);
        System.out.println("New password: " + newPassword);
        if (resetToken == null || resetToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Reset token is required");
        }
        
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("New password is required");
        }
        
        // Validate password strength
        if (!authenticationUtil.isValidPassword(newPassword)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", 
                "Password must be at least 8 characters long and contain at least one " +
                "uppercase letter, one lowercase letter, one number, and one special character.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Find the reset token
        PasswordResetToken token = tokenRepo.findByToken(resetToken);
        if (token == null) {
            return ResponseEntity.status(401).body("Invalid or expired reset token");
        }
        
        // Check if token is expired
        if (token.getExpiration().isBefore(LocalDateTime.now())) {
            tokenRepo.delete(token);
            return ResponseEntity.status(401).body("Reset token has expired");
        }
        
        // Get the user
        Optional<User> optionalUser = userRepository.findById(token.getUserId());
        if (optionalUser.isEmpty()) {
            tokenRepo.delete(token);
            return ResponseEntity.notFound().build();
        }
        
        // Update password
        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        
        // Delete all tokens for this user to prevent reuse
        tokenRepo.deleteAllByUserId(user.getId());
        
        // Log the password reset (in a production app, you might want to log this)
        System.out.println("Password reset successful for user: " + user.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password has been reset successfully");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String,Object>> verifyOtp(String otp){
        // Find the OTP token
        PasswordResetToken otpToken = tokenRepo.findByToken(otp);
        
        // Check if OTP exists
        if(otpToken == null){
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid OTP");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Check if OTP is expired
        if(otpToken.getExpiration().isBefore(LocalDateTime.now())){
            tokenRepo.delete(otpToken);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "OTP has expired");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Get the user
        Optional<User> optionalUser = userRepository.findById(otpToken.getUserId());
        if(optionalUser.isEmpty()){
            tokenRepo.delete(otpToken);
            return ResponseEntity.notFound().build();
        }
        
        User user = optionalUser.get();
        
        // Generate a secure reset token (JWT)
        String resetToken = jwtTokenProvider.generatePasswordResetToken(user.getUsername());
        
        // Delete the used OTP token
        tokenRepo.delete(otpToken);
        
        // Delete any existing reset tokens for this user
        tokenRepo.deleteAllByUserId(user.getId());
        
        // Store the new reset token in the database with expiration
        PasswordResetToken newResetToken = new PasswordResetToken();
        newResetToken.setToken(resetToken);
        newResetToken.setUserId(user.getId());
        newResetToken.setExpiration(LocalDateTime.now().plusMinutes(15)); // Reset token valid for 15 minutes
        tokenRepo.save(newResetToken);
        
        // Return success response with reset token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP verified successfully");
        response.put("resetToken", resetToken);
        return ResponseEntity.ok(response);
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

    public ResponseEntity<?> editProfile(User user) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            String username = authentication.getName();
            User existingUser = userRepository.findByUsername(username);
            
            if (existingUser == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            existingUser.setUsername(user.getUsername());
            existingUser.setEmail(user.getEmail());
            existingUser.setFavoriteDriver(user.getFavoriteDriver());
            existingUser.setFavoriteTeam(user.getFavoriteTeam());
            existingUser.setProfilePicture(user.getProfilePicture());
            userRepository.save(existingUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error editing user: " + e.getMessage());
        }
    }
}