package com.raceIQ.authentication.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.raceIQ.authentication.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        com.raceIQ.authentication.models.User user =  userRepository.findByUsername(username);
        try{
            if(user != null){
                return new User(user.getUsername(),user.getPassword(),Collections.emptyList());
            }
            throw new UsernameNotFoundException("User name not found with username: " + username);
        } catch(Exception ex){
            System.out.println(ex.getMessage());
        }
        return null;
    }
}
