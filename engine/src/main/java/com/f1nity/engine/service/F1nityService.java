package com.f1nity.engine.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f1nity.engine.impl.F1nityServiceImpl;
import com.f1nity.engine.impl.FastF1;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Race;

/**
 * Service interface for F1 data operations.
 * Delegates to implementation classes for actual functionality.
 */
@Service
public class F1nityService {

    private final FastF1 fastF1;
    
    @Autowired
    private F1nityServiceImpl f1nityServiceImpl;

    F1nityService(FastF1 fastF1) {
        this.fastF1 = fastF1;
    }

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
    
    /**
     * Updates the circuit URLs for all races in the repository.
     */
    public void updateCircuitUrls() {
        fastF1.updateCircuitUrls();
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

    public List<Map<String,String>> getResultsByYearAndByRound(String year, String round) {
        return f1nityServiceImpl.getResultsByYearAndByRound(year, round);
    }

    public Race getRaceById(String id) {
        return f1nityServiceImpl.getRaceById(id);
    }
}