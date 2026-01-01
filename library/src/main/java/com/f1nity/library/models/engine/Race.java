package com.f1nity.library.models.engine;


import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "races")
public class Race {
    @Id
    private String id;
    private String season;
    private String round;
    private String url;
    private String raceName;
    private String date;
    private String time;

    
    @JsonProperty("Circuit")
    private Circuit circuit;
    
    @JsonProperty("Results")
    private List<Result> results;

    @JsonProperty("QualifyingResults")
    private List<Result> qualifyingResults;

    @JsonProperty("SprintResults")
    private List<Result> sprintResults;

    @JsonProperty("FirstPractice")
    private Practice firstPractice;

    @JsonProperty("SecondPractice")
    private Practice secondPractice;

    @JsonProperty("ThirdPractice")
    private Practice thirdPractice;

    @JsonProperty("Sprint")
    private Practice sprint;

    @JsonProperty("Qualifying")
    private Practice qualifying;

    @JsonProperty("SprintQualifying")
    private Practice sprintQualifying;

    private boolean standingsUpdated;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public Circuit getCircuit() {
        return circuit;
    }

    public void setCircuit(Circuit circuit) {
        this.circuit = circuit;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "Race [season=" + season + ", round=" + round + ", url=" + url + ", raceName=" + raceName + ", date="
                + date + ", circuit=" + circuit + ", results=" + results + "]";
    }

    public List<Result> getQualifyingResults() {
        return qualifyingResults;
    }

    public void setQualifyingResults(List<Result> qualifyingResults) {
        this.qualifyingResults = qualifyingResults;
    }

    public List<Result> getSprintResults() {
        return sprintResults;
    }

    public void setSprintResults(List<Result> sprintResults) {
        this.sprintResults = sprintResults;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Practice getFirstPractice() {
        return firstPractice;
    }

    public void setFirstPractice(Practice firstPractice) {
        this.firstPractice = firstPractice;
    }

    public Practice getSecondPractice() {
        return secondPractice;
    }

    public void setSecondPractice(Practice secondPractice) {
        this.secondPractice = secondPractice;
    }

    public Practice getThirdPractice() {
        return thirdPractice;
    }

    public void setThirdPractice(Practice thirdPractice) {
        this.thirdPractice = thirdPractice;
    }

    public Practice getSprint() {
        return sprint;
    }

    public void setSprint(Practice sprint) {
        this.sprint = sprint;
    }

    public Practice getQualifying() {
        return qualifying;
    }

    public void setQualifying(Practice qualifying) {
        this.qualifying = qualifying;
    }

    public static class Practice{
        private String date;
        private String time;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }
    }

    public Practice getSprintQualifying() {
        return sprintQualifying;
    }

    
    public void setSprintQualifying(Practice sprintQualifying) {
        this.sprintQualifying = sprintQualifying;
    }

    public boolean getStandingsUpdated() {
        return standingsUpdated;
    }

    public void setStandingsUpdated(boolean updated){
        this.standingsUpdated = updated;
    }

}
