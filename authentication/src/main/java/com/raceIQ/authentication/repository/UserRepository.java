package com.raceIQ.authentication.repository;
import com.raceIQ.authentication.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface UserRepository extends MongoRepository<User, String>{
    public User findByUsername(String username);
    public User findByUsernameAndPassword(String username, String password);

}
