package com.raceIQ.engine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "constructors")
public class Constructor {
    
    @Id
    private String constructorId;
    private String url;
    private String name;
    private String nationality;
    private Integer wins;
    private Integer podiums;
    private Integer points;
    private Integer polePositions;
    private Integer fastestLaps;
    private Integer totalPoints;
    private Integer totalRaces;
    private Integer sprintWins;
    private Integer sprintPodiums;
    private Integer sprintRaces;
    private String colorCode;

    public String getConstructorId() {
        return constructorId;
    }
    public void setConstructorId(String constructorId) {
        this.constructorId = constructorId;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getNationality() {
        return nationality;
    }
    public void setNationality(String nationality) {
        this.nationality = nationality;
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
    public Integer getPoints() {
        return points;
    }
    public void setPoints(Integer points) {
        this.points = points;
    }
    public Integer getPolePositions() {
        return polePositions;
    }
    public void setPolePositions(Integer polePositions) {
        this.polePositions = polePositions;
    }
    public Integer getFastestLaps() {
        return fastestLaps;
    }
    public void setFastestLaps(Integer fastestLaps) {
        this.fastestLaps = fastestLaps;
    }
    public Integer getTotalPoints() {
        return totalPoints;
    }
    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Integer getSprintWins() {
        return sprintWins;
    }

    public void setSprintWins(Integer sprintWins) {
        this.sprintWins = sprintWins;
    }


    public void setColorCode(String code){
        this.colorCode = code;
    }

    public String getColorCode(){
        return this.colorCode;
    }
    
    @Override
    public String toString() {
        return "Constructor [constructorId=" + constructorId + ", url=" + url + ", name=" + name + ", nationality="
                + nationality + ", wins=" + wins + ", podiums=" + podiums + ", points=" + points + ", polePositions="
                + polePositions + ", fastestLaps=" + fastestLaps + ", totalPoints=" + totalPoints 
                + ", totalRaces=" + totalRaces + "]";
    }
    public Integer getTotalRaces() {
        return totalRaces;
    }
    public void setTotalRaces(Integer totalRaces) {
        this.totalRaces = totalRaces;
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

    
    


    
}
