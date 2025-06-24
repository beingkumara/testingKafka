package com.f1nity.authentication.security;

import java.util.Base64;
import java.util.Date;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKeyRaw;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        System.out.println("Initializing JWT with secret key (first 20 chars): " + 
            (secretKeyRaw != null ? secretKeyRaw.substring(0, Math.min(20, secretKeyRaw.length())) + "..." : "NULL"));
        System.out.println("Secret key length: " + (secretKeyRaw != null ? secretKeyRaw.length() : 0) + " characters");
        
        byte[] keyBytes = Base64.getDecoder().decode(secretKeyRaw);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        System.out.println("JWT secret key initialized successfully");
        System.out.println("Generated SecretKey algorithm: " + this.secretKey.getAlgorithm());
        System.out.println("Generated SecretKey format: " + this.secretKey.getFormat());
    }

    public String generateToken(UserDetails user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        // Using email as the subject in JWT token
        String email = user.getUsername(); // In our implementation, username is the email
        String token = Jwts.builder()
                .setSubject(email)  // Explicitly using email as subject
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
        
        System.out.println("Generated JWT token for email: " + email);
        System.out.println("Token prefix: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
        System.out.println("Secret key used (first 20 chars): " + secretKeyRaw.substring(0, Math.min(20, secretKeyRaw.length())) + "...");
        
        return token;
    }
    
    public String generatePasswordResetToken(String username) {
        Date now = new Date();
        // Password reset token expires in 15 minutes
        Date expiryDate = new Date(now.getTime() + 15 * 60 * 1000);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .claim("type", "password_reset") // Add claim to identify token type
                .compact();
    }

    public String getUsernameFromToken(String token) {
        // Clean the token by removing any surrounding quotes
        String cleanToken = cleanToken(token);
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(cleanToken)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            // Clean the token by removing any surrounding quotes
            String cleanToken = cleanToken(token);
            
            System.out.println("Validating JWT token...");
            System.out.println("Original token prefix: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
            System.out.println("Cleaned token prefix: " + (cleanToken.length() > 20 ? cleanToken.substring(0, 20) + "..." : cleanToken));
            System.out.println("Secret key for validation (first 20 chars): " + secretKeyRaw.substring(0, Math.min(20, secretKeyRaw.length())) + "...");
            
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(cleanToken);
            
            System.out.println("JWT token validation successful!");
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Malformed JWT: " + e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.out.println("JWT signature validation failed. This usually means:");
            System.out.println("1. Token was created with different secret key");
            System.out.println("2. Multiple app instances with different secrets");
            System.out.println("3. Secret key was changed after token creation");
            System.out.println("Error: " + e.getMessage());
            System.out.println("Token prefix: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
            System.out.println("Current secret key length: " + secretKeyRaw.length() + " characters");
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        } catch (JwtException e) {
            System.out.println("JWT validation error: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Clean the JWT token by removing any surrounding quotes or whitespace
     * that might have been added during transmission
     */
    private String cleanToken(String token) {
        if (token == null) {
            return null;
        }
        
        // Remove surrounding whitespace
        String cleaned = token.trim();
        
        // Remove surrounding quotes if they exist
        if (cleaned.length() >= 2) {
            if ((cleaned.startsWith("\"") && cleaned.endsWith("\"")) ||
                (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
                cleaned = cleaned.substring(1, cleaned.length() - 1);
            }
        }
        
        return cleaned;
    }
}
