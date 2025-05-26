package com.raceIQ.engine.scheduler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.raceIQ.engine.impl.FastF1;
import com.raceIQ.engine.model.Result;

/**
 * Scheduler for periodic F1 data updates.
 * Handles automatic updates of race results and other data.
 */
@Component
@EnableScheduling
public class RaceDataScheduler {

    @Autowired
    private FastF1 fastF1;
    
    /**
     * Updates the latest race results every hour.
     * This ensures that the data is always up-to-date without requiring API calls on every user request.
     * 
     * Note: This will replace any existing race entries for the latest race with updated entries
     * containing results. This is particularly important for race entries that were initially
     * stored without results (e.g., before the race was completed).
     */
    @Scheduled(fixedRate = 3600000) // Run every hour (3600000 ms)
    public void updateLatestRaceResults() {
        System.out.println("Scheduled task: Updating latest race results...");
        List<Result> latestRace = fastF1.fetchAndStoreLatestRaceResults();
        if (latestRace != null) {
            System.out.println("Updated latest race results for: " + latestRace);
        } else {
            System.out.println("Failed to update latest race results or no new results available.");
        }
    }
}