package com.f1nity.library.models.engine;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@Document(collection = "circuit_guides")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CircuitGuide {

    @Id
    private String id;

    @Indexed(unique = true)
    private String circuitId; // e.g., "monza", "silverstone"

    private String circuitName;
    private String country;

    private String summary;

    private List<String> bestGrandstands;
    private List<String> transportTips; // e.g., "Take the shuttle from Milan Central"
    private List<String> localAttractions; // e.g., "Visit the Ferrari Museum"
    private List<String> hiddenGems; // e.g., "Best pizza place nearby"

    private String currency; // e.g., "EUR"
    private String timezone; // e.g., "CET"

    private Integer firstGrandPrix; // e.g., 1950
    private Integer numberOfLaps; // e.g., 78

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getBestGrandstands() {
        return bestGrandstands;
    }

    public void setBestGrandstands(List<String> bestGrandstands) {
        this.bestGrandstands = bestGrandstands;
    }

    public List<String> getTransportTips() {
        return transportTips;
    }

    public void setTransportTips(List<String> transportTips) {
        this.transportTips = transportTips;
    }

    public List<String> getLocalAttractions() {
        return localAttractions;
    }

    public void setLocalAttractions(List<String> localAttractions) {
        this.localAttractions = localAttractions;
    }

    public List<String> getHiddenGems() {
        return hiddenGems;
    }

    public void setHiddenGems(List<String> hiddenGems) {
        this.hiddenGems = hiddenGems;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Integer getFirstGrandPrix() {
        return firstGrandPrix;
    }

    public void setFirstGrandPrix(Integer firstGrandPrix) {
        this.firstGrandPrix = firstGrandPrix;
    }

    public Integer getNumberOfLaps() {
        return numberOfLaps;
    }

    public void setNumberOfLaps(Integer numberOfLaps) {
        this.numberOfLaps = numberOfLaps;
    }
}
