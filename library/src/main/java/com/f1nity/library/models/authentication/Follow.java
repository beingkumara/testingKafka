package com.f1nity.library.models.authentication;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "follow")
public class Follow {
    @Id
    private String id;
    
    private String followerUsername;
    private String followingUsername;
    private Date createdAt;

    public Follow() {
        this.createdAt = new Date();
    }

    public Follow(String followerUsername, String followingUsername) {
        this.followerUsername = followerUsername;
        this.followingUsername = followingUsername;
        this.createdAt = new Date();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFollowerUsername() {
        return followerUsername;
    }

    public void setFollowerUsername(String followerUsername) {
        this.followerUsername = followerUsername;
    }

    public String getFollowingUsername() {
        return followingUsername;
    }

    public void setFollowingUsername(String followingUsername) {
        this.followingUsername = followingUsername;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
