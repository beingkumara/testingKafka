package com.f1nity.engine.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f1nity.engine.impl.F1nityServiceImpl;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Constructor;

/**
 * Service interface for F1 data operations.
 * Delegates to implementation classes for actual functionality.
 */
@Service
public class F1nityService {

    @Autowired
    private DataIngestionService dataIngestionService;

    @Autowired
    private F1nityServiceImpl f1nityServiceImpl;

    /**
     * Retrieves current season drivers.
     * 
     * @return List of current drivers
     */
    public List<Driver> getCurrentDrivers() {
        return f1nityServiceImpl.getCurrentDrivers();
    }

    /**
     * Retrieves all races for the current year.
     * 
     * @return List of races for the current year
     */
    public List<Race> getRacesOfCurrentYear() {
        return f1nityServiceImpl.getRacesOfCurrentYear();
    }

    public List<Driver> getAllDrivers() {
        return f1nityServiceImpl.getAllDrivers();
    }

    public List<Constructor> getAllConstructors() {
        return f1nityServiceImpl.getAllConstructors();
    }

    /**
     * Updates the circuit URLs for all races in the repository.
     */
    public void updateCircuitUrls() {
        dataIngestionService.updateCircuitUrls();
    }

    /**
     * Retrieves a specific driver by ID.
     * 
     * @param driverId The ID of the driver to retrieve
     * @return The driver with the specified ID, or null if not found
     */
    public Driver getDriverById(String driverId) {
        return f1nityServiceImpl.getDriverById(driverId);
    }

    public List<Map<String, String>> getResultsByYearAndByRound(String year, String round) {
        return f1nityServiceImpl.getResultsByYearAndByRound(year, round);
    }

    public Race getRaceById(String id) {
        return f1nityServiceImpl.getRaceById(id);
    }

    public List<DriverStanding> getDriverStandings() {
        return f1nityServiceImpl.getDriverStandings();
    }

    public List<ConstructorStanding> getConstructorStandings() {
        return f1nityServiceImpl.getConstructorStandings();
    }
}