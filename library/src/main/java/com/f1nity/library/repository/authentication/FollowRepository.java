package com.f1nity.library.repository.authentication;

import com.f1nity.library.models.authentication.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    List<Follow> findByFollowerUsernameIgnoreCase(String followerUsername);
    List<Follow> findByFollowingUsernameIgnoreCase(String followingUsername);
    Optional<Follow> findByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);
    boolean existsByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);
    void deleteByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);
    long countByFollowerUsernameIgnoreCase(String followerUsername);
    long countByFollowingUsernameIgnoreCase(String followingUsername);
}
