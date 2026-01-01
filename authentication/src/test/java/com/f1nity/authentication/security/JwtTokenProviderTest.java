package com.f1nity.authentication.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private long expirationTime = 3600000; // 1 hour

    @BeforeEach
    void setUp() throws Exception {
        jwtTokenProvider = new JwtTokenProvider();

        // Generate a real RSA key pair for testing
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        PrivateKey privateKey = keyPair.getPrivate();

        String privateKeyBase64 = Base64.getEncoder().encodeToString(privateKey.getEncoded());

        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtTokenProvider, "privateKeyRaw", privateKeyBase64);
        ReflectionTestUtils.setField(jwtTokenProvider, "expirationTime", expirationTime);

        // Initialize the provider
        jwtTokenProvider.init();
    }

    @Test
    void testGenerateToken() {
        UserDetails userDetails = new User("testuser@example.com", "password", Collections.emptyList());
        String token = jwtTokenProvider.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testGetUsernameFromToken() {
        UserDetails userDetails = new User("testuser@example.com", "password", Collections.emptyList());
        String token = jwtTokenProvider.generateToken(userDetails);

        String username = jwtTokenProvider.getUsernameFromToken(token);
        assertEquals("testuser@example.com", username);
    }

    @Test
    void testValidateToken_ValidToken() {
        UserDetails userDetails = new User("testuser@example.com", "password", Collections.emptyList());
        String token = jwtTokenProvider.generateToken(userDetails);

        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void testValidateToken_InvalidToken() {
        String invalidToken = "invalid.token.string";
        assertFalse(jwtTokenProvider.validateToken(invalidToken));
    }

    @Test
    void testGeneratePasswordResetToken() {
        String username = "testuser@example.com";
        String token = jwtTokenProvider.generatePasswordResetToken(username);

        assertNotNull(token);
        String extractedUsername = jwtTokenProvider.getUsernameFromToken(token);
        assertEquals(username, extractedUsername);
    }
}
