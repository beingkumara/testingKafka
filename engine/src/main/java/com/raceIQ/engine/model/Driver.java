package com.raceIQ.engine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents a Formula 1 driver entity.
 * Stored in the "drivers" collection in MongoDB.
 */
@Document(collection = "drivers")
public class Driver {
    
    @Id
    private String driverId;
    private String driverNumber;
    private String firstName;
    private String lastName;
    private String teamName;
    private String fullName;
    
    @JsonProperty("headshot_url")
    private String driverImageUrl;
    
    private String nationality;
    private String dateOfBirth;
    private boolean isActive;
    
    // Race statistics
    private Integer wins;
    private Integer podiums;
    private double points;
    private Integer poles;
    private Integer fastestLaps;
    private Integer totalRaces;
    
    // Sprint race statistics
    private Integer sprintWins;
    private Integer sprintPodiums;
    private Integer sprintRaces;

    // Getters and setters
    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getDriverNumber() {
        return driverNumber;
    }

    public void setDriverNumber(String driverNumber) {
        this.driverNumber = driverNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDriverImageUrl() {
        return driverImageUrl;
    }

    public void setDriverImageUrl(String driverImageUrl) {
        this.driverImageUrl = driverImageUrl;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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

    public double getPoints() {
        return points;
    }

    public void setPoints(double points) {
        this.points = points;
    }

    public Integer getPoles() {
        return poles;
    }

    public void setPoles(Integer poles) {
        this.poles = poles;
    }

    public Integer getFastestLaps() {
        return fastestLaps;
    }

    public void setFastestLaps(Integer fastestLaps) {
        this.fastestLaps = fastestLaps;
    }

    public Integer getTotalRaces() {
        return totalRaces;
    }

    public void setTotalRaces(Integer totalRaces) {
        this.totalRaces = totalRaces;
    }

    public Integer getSprintWins() {
        return sprintWins;
    }

    public void setSprintWins(Integer sprintWins) {
        this.sprintWins = sprintWins;
    }

    public Integer getSprintPodiums() {
        return sprintPodiums;
    }

    public void setSprintPodiums(Integer sprintPodiums) {
        this.sprintPodiums = sprintPodiums;
    }

    public Integer getSprintRaces() {
        return sprintRaces;
    }

    public void setSprintRaces(Integer sprintRaces) {
        this.sprintRaces = sprintRaces;
    }

    @Override
    public String toString() {
        return "Driver [driverId=" + driverId + ", driverNumber=" + driverNumber + ", firstName=" + firstName
                + ", lastName=" + lastName + ", teamName=" + teamName + ", fullName=" + fullName + ", driverImageUrl="
                + driverImageUrl + ", nationality=" + nationality + ", dateOfBirth=" + dateOfBirth + ", isActive="
                + isActive + ", wins=" + wins + ", podiums=" + podiums + ", points=" + points 
                + ", poles=" + poles + ", fastestLaps=" + fastestLaps + ", totalRaces=" + totalRaces + "]";
    }
}