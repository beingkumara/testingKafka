package com.raceIQ.engine.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.f1nity.library.models.authentication.User;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MongoTemplate authMongoTemplate;

    public UserDetailsServiceImpl(@Qualifier("authMongoTemplate") MongoTemplate authMongoTemplate) {
        this.authMongoTemplate = authMongoTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find by email (since JWT subject is email)
        Query query = new Query(Criteria.where("email").is(username));
        User user = authMongoTemplate.findOne(query, User.class, "user");
        
        // If not found by email, try by username for backward compatibility
        if (user == null) {
            query = new Query(Criteria.where("username").is(username));
            user = authMongoTemplate.findOne(query, User.class, "user");
        }
        
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username/email: " + username);
        }
        
        return new org.springframework.security.core.userdetails.User(
            user.getEmail() != null ? user.getEmail() : user.getUsername(),
            user.getPassword(),
            Collections.emptyList() // Add authorities if needed
        );
    }
}