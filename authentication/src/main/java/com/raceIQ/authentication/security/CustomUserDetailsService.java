package com.raceIQ.authentication.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.f1nity.library.repository.authentication.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        com.f1nity.library.models.authentication.User user =  userRepository.findByEmail(email);
        try{
            if(user != null){
                return new User(user.getEmail(),user.getPassword(),Collections.emptyList());
            }
            throw new UsernameNotFoundException("User name not found with email: " + email);
        } catch(Exception ex){
            System.out.println(ex.getMessage());
        }
        return null;
    }
}
