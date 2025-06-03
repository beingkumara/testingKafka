package com.raceIQ.engine.scheduler;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import com.raceIQ.engine.impl.FastF1;
import com.raceIQ.engine.model.Race;
import com.raceIQ.engine.model.Result;
import com.raceIQ.engine.repository.RaceRepository;

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
    
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("race-scheduler-");
        scheduler.initialize();
        return scheduler;
    }
    
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
        
        // Find the next race date
        Date nextExecutionTime = calculateNextExecutionTime();
        
        if (nextExecutionTime != null) {
            // Schedule the task to run at the calculated time
            scheduledTask = taskScheduler.schedule(
                this::executeRaceResultsUpdate, 
                nextExecutionTime
            );
            
            System.out.println("Next race results update scheduled for: " + nextExecutionTime);
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
    private void executeRaceResultsUpdate() {
        updateLatestRaceResults();
        // After execution, schedule the next update
        scheduleNextRaceUpdate();
    }
    
    /**
     * Calculates when the next execution should happen based on race dates
     * Returns a date that is 3 hours after the most recent race
     */
    private Date calculateNextExecutionTime() {
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
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        
        // Find the most recent race that has already occurred
        Race mostRecentRace = null;
        LocalDate mostRecentRaceDate = null;
        
        for (Race race : races) {
            if (race.getDate() != null) {
                LocalDate raceDate = LocalDate.parse(race.getDate());
                
                // If race date is today or in the past, and it's the most recent one we've found
                if (!raceDate.isAfter(today) && (mostRecentRaceDate == null || raceDate.isAfter(mostRecentRaceDate))) {
                    mostRecentRaceDate = raceDate;
                    mostRecentRace = race;
                }
            }
        }
        
        if (mostRecentRace != null) {
            // Parse the race date and time
            LocalDate raceDate = LocalDate.parse(mostRecentRace.getDate());
            LocalTime raceTime = LocalTime.parse(mostRecentRace.getTime().replace("Z", ""));
            
            // Create a LocalDateTime from the race date and time
            LocalDateTime raceDateTime = LocalDateTime.of(raceDate, raceTime);
            
            // Add 3 hours to the race time
            LocalDateTime scheduledTime = raceDateTime.plus(Duration.ofHours(3));
            
            // If the scheduled time is in the past, schedule for now + 5 minutes
            if (scheduledTime.isBefore(now)) {
                scheduledTime = now.plus(Duration.ofMinutes(5));
            }
            
            // Convert to Date
            return Date.from(scheduledTime.atZone(ZoneId.systemDefault()).toInstant());
        }
        
        return null;
    }
    
    /**
     * Updates the latest race results and standings.
     * This ensures that the data is always up-to-date without requiring API calls on every user request.
     * 
     * Note: This will replace any existing race entries for the latest race with updated entries
     * containing results. This is particularly important for race entries that were initially
     * stored without results (e.g., before the race was completed).
     */
    public void updateLatestRaceResults() {
        System.out.println("Scheduled task: Updating latest race results...");
        List<Result> latestRace = fastF1.fetchAndStoreLatestRaceResults();
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