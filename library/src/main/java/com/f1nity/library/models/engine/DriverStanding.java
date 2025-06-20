package com.f1nity.library.models.engine;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "driverstandings")
public class DriverStanding {
    @Id
    private String driverId; // Matches Driver.driverId
    private String fullName; // For display
    private int position; // Championship position
    private double points; // 2025 season points
    private int wins; // 2025 season race wins
    private int podiums; // 2025 season podiums
    private String teamName; // Current team for 2025
    private int positionsMoved = 0; // Default value of 0 for first race

    // Getters and setters
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public double getPoints() { return points; }
    public void setPoints(double points) { this.points = points; }
    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
    public int getPodiums() { return podiums; }
    public void setPodiums(int podiums) { this.podiums = podiums; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public int getPositionsMoved() { return positionsMoved; }
    public void setPositionsMoved(int positionsMoved) { this.positionsMoved = positionsMoved; }

}
