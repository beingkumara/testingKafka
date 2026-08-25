package com.f1nity.engine.controller;

import com.f1nity.engine.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final FollowService followService;

    @Autowired
    public UserController(FollowService followService) {
        this.followService = followService;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<?> followUser(@PathVariable String username) {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null || currentUsername.equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            followService.followUser(currentUsername, username);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String username) {
        String currentUsername = getCurrentUsername();
        if (currentUsername == null || currentUsername.equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        followService.unfollowUser(currentUsername, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<String>> getFollowers(@PathVariable String username) {
        return ResponseEntity.ok(followService.getFollowers(username));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<String>> getFollowing(@PathVariable String username) {
        return ResponseEntity.ok(followService.getFollowing(username));
    }

    @GetMapping("/{username}/follow-status")
    public ResponseEntity<Map<String, Object>> getFollowStatus(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        response.put("followers", followService.getFollowerCount(username));
        response.put("following", followService.getFollowingCount(username));
        
        String currentUsername = getCurrentUsername();
        boolean isFollowing = false;
        if (currentUsername != null && !currentUsername.equals("anonymousUser")) {
            isFollowing = followService.isFollowing(currentUsername, username);
        }
        response.put("isFollowing", isFollowing);

        return ResponseEntity.ok(response);
    }
}
