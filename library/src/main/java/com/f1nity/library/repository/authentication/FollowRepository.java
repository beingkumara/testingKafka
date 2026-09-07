package com.f1nity.library.repository.authentication;

import com.f1nity.library.models.authentication.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Query;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    
    @Query("{ 'followerUsername' : { $regex: ?0, $options: 'i' } }")
    List<Follow> findByFollowerUsernameIgnoreCase(String followerUsername);

    @Query("{ 'followingUsername' : { $regex: ?0, $options: 'i' } }")
    List<Follow> findByFollowingUsernameIgnoreCase(String followingUsername);

    @Query("{ 'followerUsername' : { $regex: ?0, $options: 'i' }, 'followingUsername' : { $regex: ?1, $options: 'i' } }")
    Optional<Follow> findByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);

    @Query(value = "{ 'followerUsername' : { $regex: ?0, $options: 'i' }, 'followingUsername' : { $regex: ?1, $options: 'i' } }", exists = true)
    boolean existsByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);

    @Query(value = "{ 'followerUsername' : { $regex: ?0, $options: 'i' }, 'followingUsername' : { $regex: ?1, $options: 'i' } }", delete = true)
    void deleteByFollowerUsernameIgnoreCaseAndFollowingUsernameIgnoreCase(String followerUsername, String followingUsername);

    @Query(value = "{ 'followerUsername' : { $regex: ?0, $options: 'i' } }", count = true)
    long countByFollowerUsernameIgnoreCase(String followerUsername);

    @Query(value = "{ 'followingUsername' : { $regex: ?0, $options: 'i' } }", count = true)
    long countByFollowingUsernameIgnoreCase(String followingUsername);
}
