package com.f1nity.engine.controller;

import com.f1nity.engine.service.FollowService;
import com.f1nity.engine.service.UserService;
import com.f1nity.library.models.authentication.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final FollowService followService;
    private final UserService userService;

    @Autowired
    public UserController(FollowService followService, UserService userService) {
        this.followService = followService;
        this.userService = userService;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String name = authentication.getName();
            if (name != null && !name.equals("anonymousUser")) {
                return userService.resolveUsername(name);
            }
            return name;
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

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(@RequestParam String q) {
        String currentUsername = getCurrentUsername();
        List<User> users = userService.searchUsers(q);
        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("username", user.getUsername());
            map.put("profilePicture", user.getProfilePicture());
            map.put("favoriteDriver", user.getFavoriteDriver());
            map.put("favoriteTeam", user.getFavoriteTeam());
            
            boolean isFollowing = false;
            if (currentUsername != null && !currentUsername.equals("anonymousUser") && !currentUsername.equals(user.getUsername())) {
                isFollowing = followService.isFollowing(currentUsername, user.getUsername());
            }
            map.put("isFollowing", isFollowing);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
