package com.f1nity.engine.scheduler;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import com.f1nity.engine.impl.FastF1;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.repository.engine.RaceRepository;

import jakarta.annotation.PostConstruct;

/**
 * Scheduler for periodic F1 data updates.
 * Handles automatic updates of race results and other data.
 */
@Component
@EnableScheduling
public class RaceDataScheduler {

    @Autowired
    private FastF1 fastF1;
    
    @Autowired
    private RaceRepository raceRepository;
    
    @Autowired
    private TaskScheduler taskScheduler;
    
    private ScheduledFuture<?> scheduledTask;
    
    @PostConstruct
    public void scheduleRaceResultsUpdate() {
        // Initial scheduling
        scheduleNextRaceUpdate();
    }
    
    /**
     * Schedules the next race update based on race dates
     */
    public void scheduleNextRaceUpdate() {
        // Cancel any existing scheduled task
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(false);
        }
        // Find the next race date and round
        NextRaceInfo nextInfo = calculateNextExecutionTime();
        if (nextInfo != null && nextInfo.nextExecution != null) {
            // Schedule the task to run at the calculated time
            scheduledTask = taskScheduler.schedule(
                () -> executeRaceResultsUpdate(nextInfo.nextRound),
                nextInfo.nextExecution
            );
            System.out.println("Next race results update scheduled for: " + nextInfo.nextExecution);
        } else {
            // If no specific race date is found, schedule a default check in 24 hours
            scheduledTask = taskScheduler.schedule(
                this::scheduleNextRaceUpdate,
                new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)
            );
            System.out.println("No upcoming races found. Will check again in 24 hours.");
        }
    }
    
    /**
     * Executes the race results update and schedules the next update
     */
    private void executeRaceResultsUpdate(String nextRound) {
        updateLatestRaceResults(nextRound);
        // After execution, schedule the next update
        scheduleNextRaceUpdate();
    }
    
    /**
     * Calculates when the next execution should happen based on race dates
     * Returns a date that is 3 hours after the next upcoming race
     */
private static class NextRaceInfo {
    public final Date nextExecution;
    public final String nextRound;
    public NextRaceInfo(Date nextExecution, String nextRound) {
        this.nextExecution = nextExecution;
        this.nextRound = nextRound;
    }
}

private NextRaceInfo calculateNextExecutionTime() {
        // Get all races from the repository
        List<Race> races = raceRepository.findAll();
        if (races.isEmpty()) {
            // If no races in database, fetch them
            races = fastF1.accumulateRaces();
            if (races == null || races.isEmpty()) {
                return null;
            }
        }
        
        // Current date and time
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneId.of("UTC"));
        
        // Find the next upcoming race
        Race nextRace = null;
        ZonedDateTime nextRaceDateTime = null;
        
        String nextRound = null;
    for (Race race : races) {
            if (race.getDate() != null && race.getTime() != null) {
                try {
                    LocalDate raceDate = LocalDate.parse(race.getDate());
                    // Parse time - remove any trailing 'Z' and parse as LocalTime
                    String timeStr = race.getTime().replace("Z", "");
                    LocalTime raceTime = LocalTime.parse(timeStr);
                    LocalDateTime raceDateTime = LocalDateTime.of(raceDate, raceTime);
                    
                    // Convert to UTC for comparison (assuming race times are in UTC)
                    ZonedDateTime utcRaceDateTime = raceDateTime.atZone(ZoneId.of("UTC"));
                    
                    // If race is in the future and it's either the first future race we've found
                    // or it's earlier than the current next race
                    if (utcRaceDateTime.isAfter(nowUtc) && 
                        (nextRaceDateTime == null || utcRaceDateTime.isBefore(nextRaceDateTime))) {
                        nextRace = race;
                        nextRaceDateTime = utcRaceDateTime;
                        nextRound = race.getRound();
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing race date/time: " + race.getDate() + " " + race.getTime());
                    e.printStackTrace();
                }
            }
        }
        
        if (nextRaceDateTime != null) {
            // Add 7 hours to the race time
            ZonedDateTime scheduledTime = nextRaceDateTime.plus(Duration.ofHours(7));
            // If for some reason the scheduled time is in the past (shouldn't happen), schedule for now + 30 minutes
            if (scheduledTime.isBefore(ZonedDateTime.now(ZoneId.of("UTC")))) {
                scheduledTime = ZonedDateTime.now(ZoneId.of("UTC")).plus(Duration.ofMinutes(30));
            }
            System.out.println("Next race: " + nextRace.getRaceName() + " at " + nextRaceDateTime);
            System.out.println("Scheduled data fetch for 7 hours after race: " + scheduledTime);
            return new NextRaceInfo(Date.from(scheduledTime.toInstant()), nextRound);
        }
        // If no future races found, check again in 24 hours
        System.out.println("No upcoming races found. Will check again in 24 hours.");
        return new NextRaceInfo(Date.from(ZonedDateTime.now(ZoneId.of("UTC")).plus(Duration.ofHours(24)).toInstant()), null);
    }
    
    /**
     * Updates the latest race results and standings.
     * This ensures that the data is always up-to-date without requiring API calls on every user request.
     * 
     * Note: This will replace any existing race entries for the latest race with updated entries
     * containing results. This is particularly important for race entries that were initially
     * stored without results (e.g., before the race was completed).
     */
    public void updateLatestRaceResults(String nextRound) {
        System.out.println("Scheduled task: Updating latest race results for round: " + nextRound);
        List<Result> latestRace = fastF1.fetchAndStoreLatestRaceResults(nextRound);
        if (latestRace != null) {
            System.out.println("Updated latest race results for: " + latestRace);
            // Update standings after race results are updated
            System.out.println("Updating driver and constructor standings...");
            String result = fastF1.updateStandings();
            System.out.println("Standings update result: " + result);
        } else {
            System.out.println("Failed to update latest race results or no new results available.");
        }
    }

}