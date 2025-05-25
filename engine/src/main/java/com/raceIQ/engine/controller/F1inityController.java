package com.raceIQ.engine.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raceIQ.engine.impl.FastF1;
import com.raceIQ.engine.model.Constructor;
import com.raceIQ.engine.model.ConstructorStanding;
import com.raceIQ.engine.model.Driver;
import com.raceIQ.engine.model.DriverStanding;
import com.raceIQ.engine.model.Race;
import com.raceIQ.engine.model.Result;
import com.raceIQ.engine.service.F1nityService;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping(value = "/api/v1")
public class F1inityController {
    @Autowired
    private FastF1 fastf1;

    @Autowired
    private F1nityService f1nityService;


    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return fastf1.getAllDrivers();
    }

    @GetMapping("/constructors")
    public List<Constructor> getAllConstructors() {
        return fastf1.getAllConstructors();
    }

    @GetMapping("/podiums")
    public void getPodiums() {
        fastf1.updateStatistics();
    }

    @GetMapping("/currentDrivers")
    public List<Driver> getCurrentDrivers() {
        return f1nityService.getCurrentDrivers();
    }


    @GetMapping("/sprints")
    public String getMethodName() {
        return fastf1.getSprintStatistics();
    }
    
    @GetMapping("/standings")
    public String getStandings() {
        return fastf1.updateStandings();
    }

    @GetMapping("/driver-standings")
    public List<DriverStanding> getDriverStandings() {
        return fastf1.getDriverStandings();
    }

    @GetMapping("/constructor-standings")
    public List<ConstructorStanding> getConstructorStandings() {
        return fastf1.getConstructorStandings();
    }
    
    @GetMapping("/races")
    public List<Race> getAllRaces() {
        return f1nityService.getRacesOfCurrentYear();
    }

    @GetMapping("/accumulateRaces")
    public List<Race> accumulateRaces(){
        return fastf1.accumulateRaces();
    }
    
    /**
     * Gets the latest race results from the database.
     * If no results are found in the database, it will fetch them from the API.
     * This approach prevents making API calls on every request.
     * 
     * Note: The latest race is determined by the most recent race date that has occurred,
     * not by the highest round number. For example, if only 9 out of 24 races have been
     * completed in the season, this will return the 9th race, not the 24th.
     * 
     * @return The latest race with results
     */
    @GetMapping("/latest-race-results")
    public List<Result> getLatestRaceResults() {
        return fastf1.getLatestRaceResults();
    }
    
    /**
     * Force fetches the latest race results from the API and updates the database.
     * This endpoint should be called periodically (e.g., via a scheduled task) to keep the data up-to-date.
     * 
     * Note: If a race entry already exists in the database for the latest race, it will be
     * replaced with the updated entry containing the results. This ensures that race entries
     * that were initially stored without results are properly updated once results are available.
     * 
     * @return The latest race with results
     */
    @GetMapping("/update-latest-race-results")
    public List<Result> updateLatestRaceResults() {
        return fastf1.fetchAndStoreLatestRaceResults();
    }


    @GetMapping("/updateImagesForRaces")
    public void updateImagesForRaces() {
        fastf1.updateCircuitUrls();
    }

    @GetMapping("/drivers/{driverId}")
    public Driver getDriverById(@PathVariable String driverId) {
        return f1nityService.getDriverById(driverId);
    }
    
}
