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

import com.f1nity.engine.service.DataIngestionService;
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
    private DataIngestionService dataIngestionService;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private TaskScheduler taskScheduler;

    private ScheduledFuture<?> scheduledTask;

    @PostConstruct
    public void scheduleRaceResultsUpdate() {
        // Ensure static data (drivers, constructors) is present
        dataIngestionService.initializeStaticData();

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
                    () -> executeRaceResultsUpdate(nextInfo.nextSeason, nextInfo.nextRound),
                    nextInfo.nextExecution);
            System.out.println("Next race results update scheduled for: " + nextInfo.nextExecution);
        } else {
            // If no specific race date is found, schedule a default check in 24 hours
            scheduledTask = taskScheduler.schedule(
                    this::scheduleNextRaceUpdate,
                    new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
            System.out.println("No upcoming races found. Will check again in 24 hours.");
        }
    }

    /**
     * Executes the race results update and schedules the next update
     */
    private void executeRaceResultsUpdate(String nextSeason, String nextRound) {
        updateLatestRaceResults(nextSeason, nextRound);
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
        public final String nextSeason;

        public NextRaceInfo(Date nextExecution, String nextSeason, String nextRound) {
            this.nextExecution = nextExecution;
            this.nextSeason = nextSeason;
            this.nextRound = nextRound;
        }
    }

    private NextRaceInfo calculateNextExecutionTime() {
        // Get all races from the repository
        List<Race> races = raceRepository.findAll();
        if (races.isEmpty()) {
            // If no races in database, fetch them
            races = dataIngestionService.accumulateRaces();
            if (races == null || races.isEmpty()) {
                return null;
            }
        }

        // Current date and time
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneId.of("UTC"));

        // 1. Check for any PAST races that haven't been updated yet
        // This handles the case where the application was down, or the season just
        // ended
        for (Race race : races) {
            if (race.getDate() != null && race.getTime() != null) {
                try {
                    ZonedDateTime raceDateTime = parseRaceDateTime(race);

                    // If race is in the past AND standings haven't been updated
                    // We add a small buffer (e.g. 2 hours) to ensure we don't try to update
                    // *during* the race
                    // before results are likely ready.
                    if (raceDateTime.isBefore(nowUtc) && !race.getStandingsUpdated()) {
                        System.out.println(
                                "Found pending past race: " + race.getRaceName() + " (Round " + race.getRound() + ")");

                        Date executionTime = new Date(System.currentTimeMillis() + 30 * 60 * 1000);
                        return new NextRaceInfo(executionTime, race.getSeason(), race.getRound());
                    }
                } catch (Exception e) {
                    System.err.println("Error checking past race: " + race.getRaceName());
                }
            }
        }

        // 2. Find the next upcoming race (existing logic)
        Race nextRace = null;
        ZonedDateTime nextRaceDateTime = null;
        String nextRound = null;

        for (Race race : races) {
            if (race.getDate() != null && race.getTime() != null) {
                try {
                    ZonedDateTime utcRaceDateTime = parseRaceDateTime(race);

                    // If race is in the future
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
            // Add 4 hours to the race time
            ZonedDateTime scheduledTime = nextRaceDateTime.plus(Duration.ofHours(4));
            System.out.println("Next upcoming race: " + nextRace.getRaceName() + " at " + nextRaceDateTime);
            System.out.println("Scheduled data fetch for 4 hours after race: " + scheduledTime);
            return new NextRaceInfo(Date.from(scheduledTime.toInstant()), nextRace.getSeason(), nextRound);
        }

        // If no future races found, but we might have missed something or just waiting
        // for next season
        System.out.println("No pending past races and no upcoming races found. checking again next day.");
        return new NextRaceInfo(Date.from(ZonedDateTime.now(ZoneId.of("UTC")).plus(Duration.ofHours(24)).toInstant()),
                null, null);
    }

    private ZonedDateTime parseRaceDateTime(Race race) {
        LocalDate raceDate = LocalDate.parse(race.getDate());
        // Parse time - remove any trailing 'Z' and parse as LocalTime
        String timeStr = race.getTime().replace("Z", "");
        LocalTime raceTime = LocalTime.parse(timeStr);
        LocalDateTime raceDateTime = LocalDateTime.of(raceDate, raceTime);
        return raceDateTime.atZone(ZoneId.of("UTC"));
    }

    /**
     * Updates the latest race results and standings.
     * This ensures that the data is always up-to-date without requiring API calls
     * on every user request.
     * 
     * Note: This will replace any existing race entries for the latest race with
     * updated entries
     * containing results. This is particularly important for race entries that were
     * initially
     * stored without results (e.g., before the race was completed).
     */
    public void updateLatestRaceResults(String nextSeason, String nextRound) {
        if (nextSeason == null || nextRound == null)
            return;
        System.out.println(
                "Scheduled task: Updating latest race results for year " + nextSeason + " round: " + nextRound);
        List<Result> latestRace = dataIngestionService.fetchAndStoreLatestRaceResults(nextSeason, nextRound);
        if (latestRace != null) {
            System.out.println("Updated latest race results for: " + latestRace);
            // Update standings after race results are updated
            System.out.println("Updating driver and constructor standings...");
            String result = dataIngestionService.updateStandings();
            System.out.println("Standings update result: " + result);
        } else {
            System.out.println("Failed to update latest race results or no new results available.");
        }
    }

}