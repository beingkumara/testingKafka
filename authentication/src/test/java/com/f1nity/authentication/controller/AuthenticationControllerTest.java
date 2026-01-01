package com.f1nity.authentication.controller;

import com.f1nity.authentication.service.AuthenticationService;
import com.f1nity.library.models.authentication.AuthRequest;
import com.f1nity.library.models.authentication.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthenticationControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationController authenticationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogin() {
        AuthRequest request = new AuthRequest("testuser", "test@example.com", "password");
        ResponseEntity responseEntity = ResponseEntity.ok("Login Success");
        when(authenticationService.login(any(User.class))).thenReturn(responseEntity);

        ResponseEntity<?> response = authenticationController.login(request);

        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationService).login(any(User.class));
    }

    @Test
    void testRegister() {
        AuthRequest request = new AuthRequest("testuser", "test@example.com", "password");
        ResponseEntity responseEntity = ResponseEntity.ok("Registered");
        when(authenticationService.register(request)).thenReturn(responseEntity);

        ResponseEntity<?> response = authenticationController.register(request);

        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationService).register(request);
    }

    @Test
    void testForgotPassword() {
        Map<String, String> request = Collections.singletonMap("email", "test@example.com");
        ResponseEntity responseEntity = ResponseEntity.ok("OTP Sent");
        when(authenticationService.forgotPassword("test@example.com")).thenReturn(responseEntity);

        ResponseEntity<?> response = authenticationController.forgotPassword(request);

        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationService).forgotPassword("test@example.com");
    }

    @Test
    void testResetPassword() {
        String token = "token";
        String newPassword = "newPassword";
        ResponseEntity responseEntity = ResponseEntity.ok("Password Reset");
        when(authenticationService.resetPassword(token, newPassword)).thenReturn(responseEntity);

        ResponseEntity<?> response = authenticationController.resetPassword(token, newPassword);

        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationService).resetPassword(token, newPassword);
    }

    @Test
    void testGetCurrentUser() {
        ResponseEntity responseEntity = ResponseEntity.ok(new User());
        when(authenticationService.getCurrentUser()).thenReturn(responseEntity);

        ResponseEntity<?> response = authenticationController.getCurrentUser();

        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationService).getCurrentUser();
    }
}
