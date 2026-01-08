package com.f1nity.engine.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.engine.service.DataIngestionService;
import com.f1nity.engine.service.F1nityService;
import com.f1nity.library.models.engine.Constructor;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.Result;

/**
 * REST controller for F1 data operations.
 * Provides endpoints for accessing driver, constructor, race, and standings
 * information.
 */
@RestController
@RequestMapping(value = "/api/v1")
public class F1nityController {

    @Autowired
    private DataIngestionService dataIngestionService;

    @Autowired
    private F1nityService f1nityService;

    // Driver related endpoints

    /**
     * Retrieves all drivers from the database.
     * 
     * @return List of all drivers
     */
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return dataIngestionService.syncAllDrivers();
    }

    /**
     * Retrieves current season drivers.
     * 
     * @return List of current drivers
     */
    @GetMapping("/currentDrivers")
    public List<Driver> getCurrentDrivers() {
        return f1nityService.getCurrentDrivers();
    }

    /**
     * Retrieves a specific driver by ID.
     * 
     * @param driverId The ID of the driver to retrieve
     * @return The driver with the specified ID
     */
    @GetMapping("/drivers/{driverId}")
    public Driver getDriverById(@PathVariable String driverId) {
        return f1nityService.getDriverById(driverId);
    }

    // Constructor related endpoints

    /**
     * Retrieves all constructors from the database.
     * 
     * @return List of all constructors
     */
    @GetMapping("/constructors")
    public List<Constructor> getAllConstructors() {
        return dataIngestionService.syncAllConstructors();
    }

    // Race related endpoints

    /**
     * Retrieves all races for the current year.
     * 
     * @return List of races for the current year
     */
    @GetMapping("/races")
    public List<Race> getAllRaces() {
        return f1nityService.getRacesOfCurrentYear();
    }

    /**
     * Accumulates race data from the API.
     * 
     * @return List of accumulated races
     */
    @GetMapping("/accumulateRaces")
    public List<Race> accumulateRaces() {
        return dataIngestionService.accumulateRaces();
    }

    /**
     * Updates circuit image URLs for races.
     */
    @GetMapping("/updateImagesForRaces")
    public void updateImagesForRaces() {
        dataIngestionService.updateCircuitUrls();
    }

    // Results related endpoints

    /**
     * Gets the latest race results from the database.
     * If no results are found in the database, it will fetch them from the API.
     * This approach prevents making API calls on every request.
     * 
     * Note: The latest race is determined by the most recent race date that has
     * occurred,
     * not by the highest round number. For example, if only 9 out of 24 races have
     * been
     * completed in the season, this will return the 9th race, not the 24th.
     * 
     * @return The latest race with results
     */
    @GetMapping("/latest-race-results")
    public List<Result> getLatestRaceResults() {
        return dataIngestionService.getLatestRaceResults();
    }

    // Statistics and standings endpoints

    /**
     * Updates podium statistics.
     */
    @GetMapping("/podiums")
    public void getPodiums() {
        dataIngestionService.updateStatistics();
    }

    /**
     * Retrieves sprint race statistics.
     * 
     * @return Sprint statistics as a string
     */
    @GetMapping("/sprints")
    public String getSprintStatistics() {
        return dataIngestionService.getSprintStatistics();
    }

    /**
     * Updates standings data.
     * this is to update the db. not used by the application
     * 
     * @return Status message
     */
    @GetMapping("/standings")
    public String getStandings() {
        return dataIngestionService.updateStandings();
    }

    /**
     * Retrieves current driver standings.
     * 
     * @return List of driver standings
     */
    @GetMapping("/driver-standings")
    public List<DriverStanding> getDriverStandings() {
        return f1nityService.getDriverStandings();
    }

    /**
     * Retrieves current constructor standings.
     * 
     * @return List of constructor standings
     */
    @GetMapping("/constructor-standings")
    public List<ConstructorStanding> getConstructorStandings() {
        return f1nityService.getConstructorStandings();
    }

    @GetMapping("/results/{year}/{round}")
    public List<Map<String, String>> getResultsByYearAndByRound(@PathVariable String year, @PathVariable String round) {
        return f1nityService.getResultsByYearAndByRound(year, round);
    }

    @GetMapping("/updateDriverImages")
    public void updateDriverImages() {
        dataIngestionService.updateDriverImages();
    }

    @GetMapping("/races/{id}")
    public Race getRaceById(@PathVariable String id) {
        return f1nityService.getRaceById(id);
    }

    @GetMapping("/cleanup-races")
    public String cleanupRaces() {
        // This is a temporary endpoint to help transition seasons
        // Ideally this should be in the service layer, but for quick fix adding here or
        // exposing service method
        dataIngestionService.cleanupOldRaces();
        return "Cleanup initiated";
    }

}