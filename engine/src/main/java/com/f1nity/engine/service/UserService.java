package com.f1nity.engine.service;

import com.f1nity.library.models.authentication.User;
import com.f1nity.library.repository.authentication.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MongoTemplate authMongoTemplate;

    @Autowired
    public UserService(UserRepository userRepository, @Qualifier("authMongoTemplate") MongoTemplate authMongoTemplate) {
        this.userRepository = userRepository;
        this.authMongoTemplate = authMongoTemplate;
    }

    public String resolveUsername(String identifier) {
        if (identifier == null) return null;
        // The identifier could be an email (from JWT subject) or username
        // We must query the auth database directly because UserRepository might be bound to the engine DB
        Query query = new Query(org.springframework.data.mongodb.core.query.Criteria.where("email").is(identifier));
        User user = authMongoTemplate.findOne(query, User.class, "user");
        if (user != null) {
            return user.getUsername();
        }
        
        query = new Query(org.springframework.data.mongodb.core.query.Criteria.where("username").is(identifier));
        user = authMongoTemplate.findOne(query, User.class, "user");
        if (user != null) {
            return user.getUsername();
        }
        return identifier; // Fallback
    }

    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return userRepository.searchUsers(query).stream()
                .map(user -> {
                    // Create a safe copy of the user for public consumption
                    User safeUser = new User();
                    safeUser.setUsername(user.getUsername());
                    safeUser.setProfilePicture(user.getProfilePicture());
                    safeUser.setFavoriteDriver(user.getFavoriteDriver());
                    safeUser.setFavoriteTeam(user.getFavoriteTeam());
                    return safeUser;
                })
                .collect(Collectors.toList());
    }
}
