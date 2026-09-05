package com.f1nity.engine.service;

import com.f1nity.library.models.authentication.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final MongoTemplate authMongoTemplate;

    @Autowired
    public UserService(@Qualifier("authMongoTemplate") MongoTemplate authMongoTemplate) {
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
        // Use authMongoTemplate directly since UserRepository is bound to the primary (engine) DB,
        // not the authentication DB where users are actually stored.
        Pattern regex = Pattern.compile(Pattern.quote(query.trim()), Pattern.CASE_INSENSITIVE);
        Criteria criteria = new Criteria().orOperator(
                Criteria.where("username").regex(regex),
                Criteria.where("email").regex(regex),
                Criteria.where("favoriteDriver").regex(regex),
                Criteria.where("favoriteTeam").regex(regex)
        );
        return authMongoTemplate.find(new Query(criteria), User.class, "user").stream()
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
