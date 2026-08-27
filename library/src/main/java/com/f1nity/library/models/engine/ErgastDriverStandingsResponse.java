package com.f1nity.library.models.engine;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ErgastDriverStandingsResponse {
    @JsonProperty("MRData")
    public MRData MRData;

    public static class MRData {
        @JsonProperty("StandingsTable")
        public StandingsTable StandingsTable;
    }

    public static class StandingsTable {
        @JsonProperty("StandingsLists")
        public List<StandingsList> StandingsLists;
    }

    public static class StandingsList {
        @JsonProperty("DriverStandings")
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
        @JsonProperty("Driver")
        public ErgastDriver Driver;
        @JsonProperty("Constructors")
        public List<ErgastConstructor> Constructors;
    }
}
