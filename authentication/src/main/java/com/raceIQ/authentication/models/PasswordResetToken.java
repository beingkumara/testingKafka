package com.raceIQ.authentication.models;
import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "password_reset_token")
public class PasswordResetToken{

    private String token;
    private String userId;
    private LocalDateTime expiration;

    public String getToken(){
        return this.token;
    }

    public LocalDateTime getExpiration() {
        return this.expiration;
    }

    public String getUserId(){
        return this.userId;
    }

    public String setToken(String token){
        return this.token = token;
    }

    public LocalDateTime setExpiration(LocalDateTime expiration){
        return this.expiration = expiration;
    }

    public String setUserId(String userId){
        return this.userId = userId;
    }

    @Override
    public String toString() {
        return "PasswordResetToken [token=" + token + ", userId=" + userId + ", expiration=" + expiration + "]";
    }


}