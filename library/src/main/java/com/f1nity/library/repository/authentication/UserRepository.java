package com.f1nity.library.repository.authentication;
import com.f1nity.library.models.authentication.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String>{
    public User findByUsername(String username);
    public User findByEmail(String email);
    public User findByUsernameAndPassword(String username, String password);
    
    @Query("{ '$or': [ { 'username': { '$regex': ?0, '$options': 'i' } }, { 'email': { '$regex': ?0, '$options': 'i' } }, { 'favoriteDriver': { '$regex': ?0, '$options': 'i' } }, { 'favoriteTeam': { '$regex': ?0, '$options': 'i' } } ] }")
    List<User> searchUsers(String query);
}
