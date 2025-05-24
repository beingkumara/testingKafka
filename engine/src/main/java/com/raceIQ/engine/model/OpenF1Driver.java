package com.raceIQ.engine.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)

public class OpenF1Driver {
    
    private String driverNumber;
    private String broadcastName;
    private String countryCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String sessionKey;
    private String meetngKey;
    private String team_name;
    private String headshotUrl;
    private String teamColour;
    private String nameAcronym;
    public String getDriverNumber() {
        return driverNumber;
    }
    public void setDriverNumber(String driverNumber) {
        this.driverNumber = driverNumber;
    }
    public String getBroadcastName() {
        return broadcastName;
    }
    public void setBroadcastName(String broadcastName) {
        this.broadcastName = broadcastName;
    }
    public String getCountryCode() {
        return countryCode;
    }
    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
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
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getSessionKey() {
        return sessionKey;
    }
    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }
    public String getMeetngKey() {
        return meetngKey;
    }
    public void setMeetngKey(String meetngKey) {
        this.meetngKey = meetngKey;
    }
    public String getTeam_name() {
        return team_name;
    }
    public void setTeam_name(String team_name) {
        this.team_name = team_name;
    }
    public String getHeadshotUrl() {
        return headshotUrl;
    }
    public void setHeadshotUrl(String headshotUrl) {
        this.headshotUrl = headshotUrl;
    }
    public String getTeamColour() {
        return teamColour;
    }
    public void setTeamColour(String teamColour) {
        this.teamColour = teamColour;
    }
    public String getNameAcronym() {
        return nameAcronym;
    }
    public void setNameAcronym(String nameAcronym) {
        this.nameAcronym = nameAcronym;
    }
    
    @Override
    public String toString() {
        return "OpenF1Driver [driverNumber=" + driverNumber + ", broadcastName=" + broadcastName + ", countryCode="
                + countryCode + ", firstName=" + firstName + ", lastName=" + lastName + ", fullName=" + fullName
                + ", sessionKey=" + sessionKey + ", meetngKey=" + meetngKey + ", team_name=" + team_name
                + ", headshotUrl=" + headshotUrl + ", teamColour=" + teamColour + ", nameAcronym=" + nameAcronym + "]";
    }
    


}
