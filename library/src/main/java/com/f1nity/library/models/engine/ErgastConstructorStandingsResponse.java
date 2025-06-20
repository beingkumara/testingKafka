package com.f1nity.library.models.engine;

import java.util.List;

public class ErgastConstructorStandingsResponse {
    public MRData MRData;

    public static class MRData {
        public StandingsTable StandingsTable;
    }

    public static class StandingsTable {
        public List<StandingsList> StandingsLists;
    }

    public static class StandingsList {
        public List<ConstructorStanding> ConstructorStandings;
    }

    public static class ConstructorStanding {
        public String position;
        public String points;
        public String wins;
        public ErgastConstructor Constructor;
    }
}
