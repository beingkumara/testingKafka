package com.raceIQ.engine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "constructorstandings")
public class ConstructorStanding {
    @Id
    private String constructorId; // Matches Constructor.constructorId
    private String name; // For display
    private int position; // Championship position
    private int points; // 2025 season points
    private int wins; // 2025 season race wins
    private int podiums; // 2025 season podiums
    private String color;
    private int previousPosition;

    // Getters and setters
    public String getConstructorId() { return constructorId; }
    public void setConstructorId(String constructorId) { this.constructorId = constructorId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
    public int getPodiums() { return podiums; }
    public void setPodiums(int podiums) { this.podiums = podiums; }

    public String getColor() { return color; }

    public void setColor(String color) { this.color = color; }

    public int getPreviousPosition(){ return previousPosition; }

    public void setPreviousPosition(int previousPosition){ this.previousPosition = previousPosition; }
}