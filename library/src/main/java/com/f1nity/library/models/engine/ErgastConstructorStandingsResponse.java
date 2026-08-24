package com.f1nity.library.models.engine;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ErgastConstructorStandingsResponse {
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
        @JsonProperty("ConstructorStandings")
        public List<ConstructorStanding> ConstructorStandings;
    }

    public static class ConstructorStanding {
        @JsonProperty("position")
        public String position;
        @JsonProperty("points")
        public String points;
        @JsonProperty("wins")
        public String wins;
        @JsonProperty("Constructor")
        public ErgastConstructor Constructor;
    }
}
