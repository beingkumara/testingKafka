package com.f1nity.library.models.engine;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "driverstandings")
public class DriverStanding {
    @Id
    private String driverId; // Matches Driver.driverId
    private String fullName; // For display
    private Integer position; // Championship position
    private Double points; // 2025 season points
    private Integer wins; // 2025 season race wins
    private Integer podiums; // 2025 season podiums
    private String teamName; // Current team for 2025 season
    private Integer positionsMoved = 0; // Default value of 0 for first race

    // Getters and setters
    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Integer getPositionsMoved() {
        return positionsMoved;
    }

    public void setPositionsMoved(Integer positionsMoved) {
        this.positionsMoved = positionsMoved;
    }

}
