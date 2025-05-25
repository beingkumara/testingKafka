package com.raceIQ.engine.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.raceIQ.engine.model.Race;
import com.raceIQ.engine.repository.RaceRepository;

/**
 * Utility class to update circuit URLs in the race repository
 */
@Component
public class CircuitUrlUpdater {

    @Autowired
    private RaceRepository raceRepo;

    /**
     * Updates the circuit URLs for all races in the repository
     * @return Number of races updated
     */
    public int updateCircuitUrls() {
        // Get all races from the repository
        List<Race> races = raceRepo.findAll();
        if (races.isEmpty()) {
            System.out.println("No races found in the repository");
            return 0;
        }

        // Map of circuit round numbers to their corresponding URLs
        Map<String, String> circuitUrlMap = createCircuitUrlMap();
        int updatedCount = 0;

        for (Race race : races) {
            if (race.getCircuit() != null && race.getRound() != null) {
                String round = race.getRound();
                if (circuitUrlMap.containsKey(round)) {
                    String newUrl = circuitUrlMap.get(round);
                    race.getCircuit().setUrl(newUrl);
                    updatedCount++;
                }
            }
        }

        // Save all updated races back to the repository
        if (updatedCount > 0) {
            raceRepo.saveAll(races);
            System.out.println("Updated " + updatedCount + " circuit URLs");
        } else {
            System.out.println("No circuit URLs were updated");
        }

        return updatedCount;
    }

    /**
     * Creates a mapping of race rounds to circuit URLs
     * @return Map of round numbers to circuit URLs
     */
    private Map<String, String> createCircuitUrlMap() {
        Map<String, String> map = new HashMap<>();
        
        map.put("1", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain%20carbon.png");
        map.put("2", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia%20carbon.png");
        map.put("3", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia%20carbon.png");
        map.put("4", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan%20carbon.png");
        map.put("5", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China%20carbon.png");
        map.put("6", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami%20carbon.png");
        map.put("7", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Emilia%20Romagna%20carbon.png");
        map.put("8", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Monte%20Carlo%20carbon.png");
        map.put("9", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada%20carbon.png");
        map.put("10", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain%20carbon.png");
        map.put("11", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria%20carbon.png");
        map.put("12", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain%20carbon.png");
        map.put("13", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary%20carbon.png");
        map.put("14", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Belgium%20carbon.png");
        map.put("15", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands%20carbon.png");
        map.put("16", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Italy%20carbon.png");
        map.put("17", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan%20carbon.png");
        map.put("18", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Singapore%20carbon.png");
        map.put("19", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States%20carbon.png");
        map.put("20", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Mexico%20carbon.png");
        map.put("21", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil%20carbon.png");
        map.put("22", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Las%20Vegas%20carbon.png");
        map.put("23", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Qatar%20carbon.png");
        map.put("24", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Abu%20Dhabi%20carbon.png");
        
        return map;
    }
}