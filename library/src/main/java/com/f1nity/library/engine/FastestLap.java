package com.f1nity.library.engine;


import com.fasterxml.jackson.annotation.JsonProperty;

public class FastestLap {
    private String rank;
    private String lap;
    @JsonProperty("Time")
    private Time time;
    @JsonProperty("AverageSpeed")
    private AverageSpeed averageSpeed;

    // Getters and Setters
    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getLap() {
        return lap;
    }

    public void setLap(String lap) {
        this.lap = lap;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    public AverageSpeed getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(AverageSpeed averageSpeed) {
        this.averageSpeed = averageSpeed;
    }

    // Nested Time class
    public static class Time {
        private String time;

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        @Override
        public String toString() {
            return "Time [time=" + time + "]";
        }
    }

    // Nested AverageSpeed class
    public static class AverageSpeed {
        private String units;
        private String speed;

        public String getUnits() {
            return units;
        }

        public void setUnits(String units) {
            this.units = units;
        }

        public String getSpeed() {
            return speed;
        }

        public void setSpeed(String speed) {
            this.speed = speed;
        }

        @Override
        public String toString() {
            return "AverageSpeed [units=" + units + ", speed=" + speed + "]";
        }
    }

    @Override
    public String toString() {
        return "FastestLap [rank=" + rank + ", lap=" + lap + ", time=" + time + ", averageSpeed=" + averageSpeed + "]";
    }
}