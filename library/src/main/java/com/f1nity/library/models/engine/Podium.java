package com.f1nity.library.models.engine;


import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Document(collection = "podiums")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Podium {
    private String season;
    private String round;
    private String raceName;
    private String date;
    private String circuitId;
    private String circuitName;
    
    // First place
    private String firstDriverId;
    private String firstDriverName;
    private String firstConstructorId;
    private String firstConstructorName;
    
    // Second place
    private String secondDriverId;
    private String secondDriverName;
    private String secondConstructorId;
    private String secondConstructorName;
    
    // Third place
    private String thirdDriverId;
    private String thirdDriverName;
    private String thirdConstructorId;
    private String thirdConstructorName;

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getRound() {
        return round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public String getRaceName() {
        return raceName;
    }

    public void setRaceName(String raceName) {
        this.raceName = raceName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCircuitId() {
        return circuitId;
    }

    public void setCircuitId(String circuitId) {
        this.circuitId = circuitId;
    }

    public String getCircuitName() {
        return circuitName;
    }

    public void setCircuitName(String circuitName) {
        this.circuitName = circuitName;
    }

    public String getFirstDriverId() {
        return firstDriverId;
    }

    public void setFirstDriverId(String firstDriverId) {
        this.firstDriverId = firstDriverId;
    }

    public String getFirstDriverName() {
        return firstDriverName;
    }

    public void setFirstDriverName(String firstDriverName) {
        this.firstDriverName = firstDriverName;
    }

    public String getFirstConstructorId() {
        return firstConstructorId;
    }

    public void setFirstConstructorId(String firstConstructorId) {
        this.firstConstructorId = firstConstructorId;
    }

    public String getFirstConstructorName() {
        return firstConstructorName;
    }

    public void setFirstConstructorName(String firstConstructorName) {
        this.firstConstructorName = firstConstructorName;
    }

    public String getSecondDriverId() {
        return secondDriverId;
    }

    public void setSecondDriverId(String secondDriverId) {
        this.secondDriverId = secondDriverId;
    }

    public String getSecondDriverName() {
        return secondDriverName;
    }

    public void setSecondDriverName(String secondDriverName) {
        this.secondDriverName = secondDriverName;
    }

    public String getSecondConstructorId() {
        return secondConstructorId;
    }

    public void setSecondConstructorId(String secondConstructorId) {
        this.secondConstructorId = secondConstructorId;
    }

    public String getSecondConstructorName() {
        return secondConstructorName;
    }

    public void setSecondConstructorName(String secondConstructorName) {
        this.secondConstructorName = secondConstructorName;
    }

    public String getThirdDriverId() {
        return thirdDriverId;
    }

    public void setThirdDriverId(String thirdDriverId) {
        this.thirdDriverId = thirdDriverId;
    }

    public String getThirdDriverName() {
        return thirdDriverName;
    }

    public void setThirdDriverName(String thirdDriverName) {
        this.thirdDriverName = thirdDriverName;
    }

    public String getThirdConstructorId() {
        return thirdConstructorId;
    }

    public void setThirdConstructorId(String thirdConstructorId) {
        this.thirdConstructorId = thirdConstructorId;
    }

    public String getThirdConstructorName() {
        return thirdConstructorName;
    }

    public void setThirdConstructorName(String thirdConstructorName) {
        this.thirdConstructorName = thirdConstructorName;
    }

    @Override
    public String toString() {
        return "Podium [season=" + season + ", round=" + round + ", raceName=" + raceName + ", date=" + date
                + ", circuitId=" + circuitId + ", circuitName=" + circuitName + ", firstDriverId=" + firstDriverId
                + ", firstDriverName=" + firstDriverName + ", firstConstructorId=" + firstConstructorId
                + ", firstConstructorName=" + firstConstructorName + ", secondDriverId=" + secondDriverId
                + ", secondDriverName=" + secondDriverName + ", secondConstructorId=" + secondConstructorId
                + ", secondConstructorName=" + secondConstructorName + ", thirdDriverId=" + thirdDriverId
                + ", thirdDriverName=" + thirdDriverName + ", thirdConstructorId=" + thirdConstructorId
                + ", thirdConstructorName=" + thirdConstructorName + "]";
    }
}