package com.f1nity.authentication.utils;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationUtil {
    
    public boolean isValidEmailAddress(String email){
        if (email == null || email.isEmpty()) {
            return false;
        }
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(emailRegex);
    }

    public boolean isValidPassword(String password){
        if(password == null || password.isEmpty()){
            return false;
        }

        // Check if password has at least 8 characters
        if(password.length() < 8){
            return false;
        }
        
        // Check for at least one lowercase letter
        if(!password.matches(".*[a-z].*")){
            return false;
        }
        
        // Check for at least one uppercase letter
        if(!password.matches(".*[A-Z].*")){
            return false;
        }
        
        // Check for at least one digit
        if(!password.matches(".*\\d.*")){
            return false;
        }
        
        // Check for at least one special character
        if(!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")){
            return false;
        }
        
        return true;
    }
}
