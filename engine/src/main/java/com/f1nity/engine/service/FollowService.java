package com.f1nity.engine.service;

import com.f1nity.library.models.authentication.Follow;
import com.f1nity.library.repository.authentication.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    private final FollowRepository followRepository;

    @Autowired
    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    public void followUser(String followerUsername, String followingUsername) {
        if (followerUsername.equals(followingUsername)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }
        if (!followRepository.existsByFollowerUsernameAndFollowingUsername(followerUsername, followingUsername)) {
            Follow follow = new Follow(followerUsername, followingUsername);
            followRepository.save(follow);
        }
    }

    public void unfollowUser(String followerUsername, String followingUsername) {
        followRepository.deleteByFollowerUsernameAndFollowingUsername(followerUsername, followingUsername);
    }

    public List<String> getFollowers(String username) {
        return followRepository.findByFollowingUsername(username).stream()
                .map(Follow::getFollowerUsername)
                .collect(Collectors.toList());
    }

    public List<String> getFollowing(String username) {
        return followRepository.findByFollowerUsername(username).stream()
                .map(Follow::getFollowingUsername)
                .collect(Collectors.toList());
    }

    public boolean isFollowing(String followerUsername, String followingUsername) {
        return followRepository.existsByFollowerUsernameAndFollowingUsername(followerUsername, followingUsername);
    }

    public long getFollowerCount(String username) {
        return followRepository.countByFollowingUsername(username);
    }

    public long getFollowingCount(String username) {
        return followRepository.countByFollowerUsername(username);
    }
}
