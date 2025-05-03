package com.raceIQ.authentication.security;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.raceIQ.authentication.models.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    public String generateToken(User user){
        return Jwts.builder().
                setSubject(user.getUsername()).
                setIssuedAt(new Date()).
                setExpiration(new Date(System.currentTimeMillis() + expirationTime)).
                signWith(SignatureAlgorithm.HS512, secretKey).
                compact();
    }

    public String getUsernameFromToken(String token){
        return Jwts.parser().
                setSigningKey(secretKey).
                parseClaimsJws(token).
                getBody().
                getSubject();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
