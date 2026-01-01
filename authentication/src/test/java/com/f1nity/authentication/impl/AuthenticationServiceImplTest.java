package com.f1nity.authentication.impl;

import com.f1nity.authentication.security.JwtTokenProvider;
import com.f1nity.authentication.utils.AuthenticationUtil;
import com.f1nity.authentication.utils.SecureOTPGenerator;
import com.f1nity.library.models.authentication.AuthRequest;
import com.f1nity.library.models.authentication.PasswordResetToken;
import com.f1nity.library.models.authentication.User;
import com.f1nity.library.repository.authentication.PasswordResetTokenRepository;
import com.f1nity.library.repository.authentication.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthenticationServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private PasswordResetTokenRepository tokenRepo;
    @Mock
    private AuthenticationUtil authenticationUtil;
    @Mock
    private SecureOTPGenerator otpGenerator;
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Inject the mailSender field manually as it's autowired in the service
        ReflectionTestUtils.setField(authenticationService, "mailSender", mailSender);
    }

    @Test
    void testLogin_Success() {
        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("password");

        User dbUser = new User();
        dbUser.setEmail("test@example.com");
        dbUser.setUsername("testuser");
        dbUser.setPassword("encodedPassword");

        when(userRepository.findByEmail("testuser")).thenReturn(null);

        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testuser");
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn("jwt-token");

        ResponseEntity<?> response = authenticationService.login(loginUser);

        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("Login Success", body.get("message"));
        assertEquals("jwt-token", body.get("token"));
    }

    @Test
    void testLogin_Failure() {
        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("wrongpassword");

        when(userRepository.findByEmail("testuser")).thenReturn(null);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        ResponseEntity<?> response = authenticationService.login(loginUser);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testRegister_Success() {
        AuthRequest request = new AuthRequest("testuser", "test@example.com", "Password@123");

        when(userRepository.findByUsername(request.getUsername())).thenReturn(null);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);
        when(authenticationUtil.isValidEmailAddress(request.getEmail())).thenReturn(true);
        when(authenticationUtil.isValidPassword(request.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        ResponseEntity<?> response = authenticationService.register(request);

        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Registration successful", body.get("message"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_UserAlreadyExists() {
        AuthRequest request = new AuthRequest("testuser", "test@example.com", "Password@123");

        when(userRepository.findByUsername(request.getUsername())).thenReturn(new User());

        ResponseEntity<?> response = authenticationService.register(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("User already exists", body.get("message"));
    }

    @Test
    void testForgotPassword_Success() throws Exception {
        String email = "test@example.com";
        User user = new User();
        user.setId("userId");
        user.setEmail(email);
        user.setUsername("testuser");

        when(userRepository.findByEmail(email)).thenReturn(user);
        when(otpGenerator.generateSecureOTP()).thenReturn("123456");

        // Mock tokenRepo behavior
        doNothing().when(tokenRepo).deleteAllByUserId(user.getId());
        when(tokenRepo.save(any(PasswordResetToken.class))).thenReturn(new PasswordResetToken());

        ResponseEntity<?> response = authenticationService.forgotPassword(email);

        assertEquals(200, response.getStatusCodeValue());
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testResetPassword_Success() {
        String token = "valid-token";
        String newPassword = "NewPassword@123";

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId("userId");
        resetToken.setExpiration(LocalDateTime.now().plusMinutes(10));

        User user = new User();
        user.setId("userId");
        user.setUsername("testuser");

        when(authenticationUtil.isValidPassword(newPassword)).thenReturn(true);
        when(tokenRepo.findByToken(token)).thenReturn(resetToken);
        when(userRepository.findById("userId")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

        ResponseEntity<?> response = authenticationService.resetPassword(token, newPassword);

        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository, times(1)).save(user);
        // verify(tokenRepo, times(1)).delete(resetToken); // logic says delete only if
        // expired
        // Code says: tokenRepo.deleteAllByUserId(user.getId());
        verify(tokenRepo, times(1)).deleteAllByUserId("userId");
    }
}
