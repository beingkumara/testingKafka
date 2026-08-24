package com.f1nity.engine.scheduler;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ScheduledFuture;
import java.util.stream.Collectors;

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
 *
 * <p>On startup, this scheduler:
 * <ol>
 *   <li>Initialises static data (drivers, constructors).</li>
 *   <li>Always refreshes the race calendar from the API so newly-added rounds
 *       are visible after a period of downtime.</li>
 *   <li>Catches up <em>all</em> past rounds whose standings were never updated
 *       (e.g. the app was offline during those race weekends), processing them
 *       synchronously in chronological order before normal scheduling begins.</li>
 *   <li>Schedules the next future race update.</li>
 * </ol>
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
        // Step 1: Ensure static data (drivers, constructors) is present.
        dataIngestionService.initializeStaticData();

        // Step 2 (Fix #4): Always refresh the race calendar on startup.
        // Previously this was only done when the DB was empty, which meant rounds
        // added to the calendar during downtime were never picked up.
        System.out.println("Refreshing race calendar from API...");
        dataIngestionService.accumulateRaces();

        // Step 3 (Fix #1 & #2): Synchronously process every past round whose
        // standings were missed while the application was offline.
        catchUpMissedRounds();

        // Step 4: Sync standings from current Driver/Constructor entity state.
        // This is a fast, lightweight call — no race results are fetched.
        // It is needed to back-fill fields that were added to updateStandings()
        // after rounds were already processed (e.g. podiums). Rounds with
        // standingsUpdated=true are skipped by catchUpMissedRounds(), so their
        // Driver.podiums values are correct in the drivers collection but were
        // never copied into DriverStanding. One updateStandings() call here
        // repairs that gap on every startup without re-processing any race data.
        System.out.println("Syncing standings snapshot from entity state...");
        dataIngestionService.updateStandings();

        // Step 5: Start the regular forward-looking scheduler for upcoming races.
        scheduleNextRaceUpdate();
    }

    /**
     * Processes all past races whose {@code standingsUpdated} flag is still
     * {@code false}, in chronological order.
     *
     * <p>This replaces the old single-race-at-a-time catch-up that was baked into
     * {@link #calculateNextExecutionTime()}. Previously the scheduler found one
     * missed round, waited 30 minutes, processed it, then found the next one —
     * meaning 3 missed rounds took ~1.5 hours before standings were current.
     * Now all missed rounds are processed immediately and sequentially on startup.
     */
    private void catchUpMissedRounds() {
        List<Race> allRaces = raceRepository.findAll();
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneId.of("UTC"));

        // Collect every past race that has not yet had its standings updated,
        // then sort chronologically so we replay in the correct order.
        List<Race> pendingRaces = allRaces.stream()
                .filter(r -> r.getDate() != null && r.getTime() != null)
                .filter(r -> !r.getStandingsUpdated())
                .filter(r -> {
                    try {
                        return parseRaceDateTime(r).isBefore(nowUtc);
                    } catch (Exception e) {
                        System.err.println("Could not parse date for race: " + r.getRaceName() + " — skipping.");
                        return false;
                    }
                })
                .sorted(Comparator.comparing(r -> LocalDate.parse(r.getDate())))
                .collect(Collectors.toList());

        if (pendingRaces.isEmpty()) {
            System.out.println("Catch-up: No missed rounds found. Standings are up to date.");
            return;
        }

        System.out.println("Catch-up: Found " + pendingRaces.size() + " unprocessed past round(s). "
                + "Processing synchronously before resuming normal scheduling...");

        for (Race race : pendingRaces) {
            System.out.println("Catch-up: Processing " + race.getRaceName()
                    + " (Season " + race.getSeason() + ", Round " + race.getRound() + ")");
            updateLatestRaceResults(race.getSeason(), race.getRound());
        }

        System.out.println("Catch-up: All missed rounds processed. Standings are now current.");
    }

    /**
     * Schedules the next race update based on race dates.
     */
    public void scheduleNextRaceUpdate() {
        // Cancel any existing scheduled task.
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(false);
        }
        // Find the next race date and round.
        NextRaceInfo nextInfo = calculateNextExecutionTime();
        if (nextInfo != null && nextInfo.nextExecution != null) {
            // Schedule the task to run at the calculated time.
            scheduledTask = taskScheduler.schedule(
                    () -> executeRaceResultsUpdate(nextInfo.nextSeason, nextInfo.nextRound),
                    nextInfo.nextExecution);
            System.out.println("Next race results update scheduled for: " + nextInfo.nextExecution);
        } else {
            // If no specific race date is found, schedule a default check in 24 hours.
            scheduledTask = taskScheduler.schedule(
                    this::scheduleNextRaceUpdate,
                    new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
            System.out.println("No upcoming races found. Will check again in 24 hours.");
        }
    }

    /**
     * Executes the race results update and schedules the next update.
     */
    private void executeRaceResultsUpdate(String nextSeason, String nextRound) {
        updateLatestRaceResults(nextSeason, nextRound);
        // After execution, schedule the next update.
        scheduleNextRaceUpdate();
    }

    /**
     * Holds the information needed to schedule the next task execution.
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

    /**
     * Calculates when the next scheduled execution should happen.
     *
     * <p>After {@link #catchUpMissedRounds()} has run on startup, this method
     * should only ever see future races (all past ones will have
     * {@code standingsUpdated == true}). The past-race fallback branch is kept
     * as a safety net for any edge case the catch-up may have missed (e.g. a race
     * whose date/time could not be parsed during catch-up).
     *
     * <p><strong>Fix #2</strong>: When a past race <em>is</em> found here as a
     * safety net, it is scheduled with a 1-second delay instead of the original
     * 30-minute delay. The 30-minute delay was appropriate for live races (waiting
     * for the external API to publish results), but past races are already fully
     * published and should be fetched immediately.
     */
    private NextRaceInfo calculateNextExecutionTime() {
        // Get all races from the repository.
        List<Race> races = raceRepository.findAll();

        // Check if we have 2026 races.
        boolean hasCurrentSeason = races.stream().anyMatch(r -> "2026".equals(r.getSeason()));

        if (races.isEmpty() || !hasCurrentSeason) {
            // If no races or no 2026 races, fetch them.
            // (This path should rarely be hit now that accumulateRaces() is always
            // called in @PostConstruct, but kept as a defensive fallback.)
            System.out.println("Missing 2026 race data. Fetching from API...");
            List<Race> newRaces = dataIngestionService.accumulateRaces();

            if (newRaces != null && !newRaces.isEmpty()) {
                races = raceRepository.findAll();
            } else if (races.isEmpty()) {
                // If we had nothing and fetched nothing, we can't proceed.
                return null;
            }
        }

        // Current date and time.
        ZonedDateTime nowUtc = ZonedDateTime.now(ZoneId.of("UTC"));

        // Safety-net: if any past race still has standingsUpdated == false
        // (e.g. catchUpMissedRounds skipped it due to a parse error), schedule it
        // immediately rather than using the old 30-minute delay.
        for (Race race : races) {
            if (race.getDate() != null && race.getTime() != null) {
                try {
                    ZonedDateTime raceDateTime = parseRaceDateTime(race);

                    if (raceDateTime.isBefore(nowUtc) && !race.getStandingsUpdated()) {
                        System.out.println("Safety-net: Found unprocessed past race: "
                                + race.getRaceName() + " (Round " + race.getRound() + "). "
                                + "Scheduling immediately.");

                        // Fix #2: Use 1-second delay (not 30 minutes) — results are already
                        // published for past races; there is nothing to wait for.
                        Date executionTime = new Date(System.currentTimeMillis() + 1_000);
                        return new NextRaceInfo(executionTime, race.getSeason(), race.getRound());
                    }
                } catch (Exception e) {
                    System.err.println("Error checking past race: " + race.getRaceName());
                }
            }
        }

        // Find the next upcoming race.
        Race nextRace = null;
        ZonedDateTime nextRaceDateTime = null;
        String nextRound = null;

        for (Race race : races) {
            if (race.getDate() != null && race.getTime() != null) {
                try {
                    ZonedDateTime utcRaceDateTime = parseRaceDateTime(race);

                    // If race is in the future.
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
            // Fetch results 4 hours after race start — enough time for the external
            // API to publish the official results.
            ZonedDateTime scheduledTime = nextRaceDateTime.plus(Duration.ofHours(4));
            System.out.println("Next upcoming race: " + nextRace.getRaceName() + " at " + nextRaceDateTime);
            System.out.println("Scheduled data fetch for 4 hours after race: " + scheduledTime);
            return new NextRaceInfo(Date.from(scheduledTime.toInstant()), nextRace.getSeason(), nextRound);
        }

        // No future races found; check again tomorrow.
        System.out.println("No pending past races and no upcoming races found. Checking again next day.");
        return new NextRaceInfo(
                Date.from(ZonedDateTime.now(ZoneId.of("UTC")).plus(Duration.ofHours(24)).toInstant()),
                null, null);
    }

    private ZonedDateTime parseRaceDateTime(Race race) {
        LocalDate raceDate = LocalDate.parse(race.getDate());
        // Parse time — remove any trailing 'Z' and parse as LocalTime.
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
     * <p>Note: This will replace any existing race entries for the latest race with
     * updated entries containing results. This is particularly important for race
     * entries that were initially stored without results (e.g., before the race
     * was completed).
     */
    public void updateLatestRaceResults(String nextSeason, String nextRound) {
        if (nextSeason == null || nextRound == null)
            return;
        System.out.println(
                "Scheduled task: Updating latest race results for year " + nextSeason + " round: " + nextRound);
        List<Result> latestRace = dataIngestionService.fetchAndStoreLatestRaceResults(nextSeason, nextRound);
        if (latestRace != null && !latestRace.isEmpty()) {
            System.out.println("Updated latest race results. Updating driver and constructor standings...");
            String result = dataIngestionService.updateStandings();
            System.out.println("Standings update result: " + result);
        } else {
            System.out.println("Failed to update latest race results or no new results available.");
        }
    }

}