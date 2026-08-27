package com.f1nity.library.repository.authentication;

import com.f1nity.library.models.authentication.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    List<Follow> findByFollowerUsername(String followerUsername);
    List<Follow> findByFollowingUsername(String followingUsername);
    Optional<Follow> findByFollowerUsernameAndFollowingUsername(String followerUsername, String followingUsername);
    boolean existsByFollowerUsernameAndFollowingUsername(String followerUsername, String followingUsername);
    void deleteByFollowerUsernameAndFollowingUsername(String followerUsername, String followingUsername);
    long countByFollowerUsername(String followerUsername);
    long countByFollowingUsername(String followingUsername);
}
