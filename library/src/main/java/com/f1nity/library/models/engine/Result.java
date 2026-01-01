package com.f1nity.library.models.engine;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Result {
    private String number;
    private String position;
    private String positionText;
    private String points;
    private String grid;
    private String laps;
    private String status;
    private String Q1;
    private String Q2;
    private String Q3;

    @JsonProperty("FastestLap")
    private FastestLap fastestLap;

    @JsonProperty("Time")
    private Time time;

    @JsonProperty("Driver")
    private ErgastDriver driver;

    @JsonProperty("Constructor")
    private ErgastConstructor constructor;

    // Added to support display in UI
    private String raceName;
    private String date;

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

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPositionText() {
        return positionText;
    }

    public void setPositionText(String positionText) {
        this.positionText = positionText;
    }

    public String getPoints() {
        return points;
    }

    public void setPoints(String points) {
        this.points = points;
    }

    public String getGrid() {
        return grid;
    }

    public void setGrid(String grid) {
        this.grid = grid;
    }

    public String getLaps() {
        return laps;
    }

    public void setLaps(String laps) {
        this.laps = laps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    public ErgastDriver getDriver() {
        return driver;
    }

    public void setDriver(ErgastDriver driver) {
        this.driver = driver;
    }

    public ErgastConstructor getConstructor() {
        return constructor;
    }

    public void setConstructor(ErgastConstructor constructor) {
        this.constructor = constructor;
    }

    public String getQ1() {
        return Q1;
    }

    public void setQ1(String q1) {
        Q1 = q1;
    }

    public String getQ2() {
        return Q2;
    }

    public void setQ2(String q2) {
        Q2 = q2;
    }

    public String getQ3() {
        return Q3;
    }

    public void setQ3(String q3) {
        Q3 = q3;
    }

    @Override
    public String toString() {
        return "Result [number=" + number + ", position=" + position + ", positionText=" + positionText + ", points="
                + points + ", grid=" + grid + ", laps=" + laps + ", status=" + status + ", time=" + time + ", driver="
                + driver + ", constructor=" + constructor + "]";
    }

    public FastestLap getFastestLap() {
        return fastestLap;
    }

    public void setFastestLap(FastestLap fastestLap) {
        this.fastestLap = fastestLap;
    }
}
