package com.f1nity.authentication.security;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.spec.RSAPublicKeySpec;

@Component
public class JwtTokenProvider {

    @Value("${jwt.private-key}")
    private String privateKeyRaw;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void init() {
        try {
            String sanitizedKey = privateKeyRaw.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] keyBytes = Base64.getDecoder().decode(sanitizedKey);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            this.privateKey = kf.generatePrivate(spec);

            if (this.privateKey instanceof RSAPrivateCrtKey) {
                RSAPrivateCrtKey privk = (RSAPrivateCrtKey) this.privateKey;
                RSAPublicKeySpec publicKeySpec = new RSAPublicKeySpec(privk.getModulus(), privk.getPublicExponent());
                this.publicKey = kf.generatePublic(publicKeySpec);
                System.out.println("JWT RSA keys initialized successfully");
            } else {
                System.err.println("Could not derive public key: private key is not an RSAPrivateCrtKey");
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not initialize JWT private key", e);
        }
    }

    public String generateToken(UserDetails user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        String email = user.getUsername();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public String generatePasswordResetToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 15 * 60 * 1000);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .claim("type", "password_reset")
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token) // This will throw exception if signature is invalid
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }

    private String cleanToken(String token) {
        if (token == null) {
            return null;
        }
        String cleaned = token.trim();
        if (cleaned.length() >= 2) {
            if ((cleaned.startsWith("\"") && cleaned.endsWith("\"")) ||
                    (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
                cleaned = cleaned.substring(1, cleaned.length() - 1);
            }
        }
        return cleaned;
    }
}
