package com.raceIQ.engine.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErgastDriverStandingsResponse {
    public MRData MRData;

    public static class MRData {
        public StandingsTable StandingsTable;
    }

    public static class StandingsTable {
        public List<StandingsList> StandingsLists;
    }

    public static class StandingsList {
        public List<DriverStanding> DriverStandings;
    }

    public static class DriverStanding {
        @JsonProperty("position")
        public String position;
        @JsonProperty("points")
        public String points;
        @JsonProperty("wins")
        public String wins;
        @JsonProperty("positionText")
        public String positionText;
        public ErgastDriver Driver;
        public List<ErgastConstructor> Constructors;
    }
}