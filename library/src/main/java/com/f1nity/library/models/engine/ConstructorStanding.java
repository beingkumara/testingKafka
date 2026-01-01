package com.f1nity.library.models.engine;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "constructorstandings")
public class ConstructorStanding {
    @Id
    private String id; // Unique identifier for the standing entry
    private String constructorId; // Matches Constructor.constructorId
    private String name; // For display
    private Integer position; // Championship position
    private Double points; // 2025 season points
    private Integer wins; // 2025 season race wins
    private Integer podiums; // 2025 season podiums
    private String color;
    private Integer positionsMoved = 0;

    // Getters and setters
    public String getConstructorId() {
        return constructorId;
    }

    public void setConstructorId(String constructorId) {
        this.constructorId = constructorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Double getPoints() {
        return points;
    }

    public void setPoints(Double points) {
        this.points = points;
    }

    public Integer getWins() {
        return wins;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public Integer getPodiums() {
        return podiums;
    }

    public void setPodiums(Integer podiums) {
        this.podiums = podiums;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getPositionsMoved() {
        return positionsMoved;
    }

    public void setPositionsMoved(Integer positionsMoved) {
        this.positionsMoved = positionsMoved;
    }
}
