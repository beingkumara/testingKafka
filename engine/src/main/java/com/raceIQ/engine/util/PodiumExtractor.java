package com.raceIQ.engine.util;

import java.util.List;
import java.util.stream.Collectors;

import com.raceIQ.engine.model.Podium;
import com.raceIQ.engine.model.Race;
import com.raceIQ.engine.model.RaceResponse;
import com.raceIQ.engine.model.Result;

public class PodiumExtractor {

    /**
     * Extracts podium information from a race response
     * 
     * @param raceResponse The race response from Ergast API
     * @return A Podium object containing the top 3 finishers
     */
    public static Podium extractPodium(RaceResponse raceResponse) {
        if (raceResponse == null || raceResponse.getMrData() == null || 
            raceResponse.getMrData().getRaceTable() == null || 
            raceResponse.getMrData().getRaceTable().getRaces() == null || 
            raceResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
            return null;
        }
        
        Race race = raceResponse.getMrData().getRaceTable().getRaces().get(0);
        List<Result> results = race.getResults();
        
        if (results == null || results.size() < 3) {
            return null;
        }
        
        // Sort results by position
        List<Result> sortedResults = results.stream()
                .sorted((r1, r2) -> {
                    try {
                        return Integer.parseInt(r1.getPosition()) - Integer.parseInt(r2.getPosition());
                    } catch (NumberFormatException e) {
                        return r1.getPositionText().compareTo(r2.getPositionText());
                    }
                })
                .collect(Collectors.toList());
        
        // Get top 3 finishers
        Result first = sortedResults.get(0);
        Result second = sortedResults.get(1);
        Result third = sortedResults.get(2);
        
        Podium podium = new Podium();
        
        // Set race information
        podium.setSeason(race.getSeason());
        podium.setRound(race.getRound());
        podium.setRaceName(race.getRaceName());
        podium.setDate(race.getDate());
        podium.setCircuitId(race.getCircuit().getCircuitId());
        podium.setCircuitName(race.getCircuit().getCircuitName());
        
        // Set first place
        podium.setFirstDriverId(first.getDriver().getDriverId());
        podium.setFirstDriverName(first.getDriver().getGivenName() + " " + first.getDriver().getFamilyName());
        podium.setFirstConstructorId(first.getConstructor().getConstructorId());
        podium.setFirstConstructorName(first.getConstructor().getName());
        
        // Set second place
        podium.setSecondDriverId(second.getDriver().getDriverId());
        podium.setSecondDriverName(second.getDriver().getGivenName() + " " + second.getDriver().getFamilyName());
        podium.setSecondConstructorId(second.getConstructor().getConstructorId());
        podium.setSecondConstructorName(second.getConstructor().getName());
        
        // Set third place
        podium.setThirdDriverId(third.getDriver().getDriverId());
        podium.setThirdDriverName(third.getDriver().getGivenName() + " " + third.getDriver().getFamilyName());
        podium.setThirdConstructorId(third.getConstructor().getConstructorId());
        podium.setThirdConstructorName(third.getConstructor().getName());
        
        return podium;
    }
}