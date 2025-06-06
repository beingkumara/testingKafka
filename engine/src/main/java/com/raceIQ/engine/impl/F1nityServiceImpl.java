package com.raceIQ.engine.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raceIQ.engine.model.Driver;
import com.raceIQ.engine.model.Race;
import com.raceIQ.engine.repository.DriverRepository;
import com.raceIQ.engine.repository.RaceRepository;

/**
 * Implementation of F1 data service operations.
 * Provides methods for retrieving driver and race information.
 */
@Service
public class F1nityServiceImpl {

    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private RaceRepository raceRepo;

    @Autowired
    private FastF1 fastF1;

    /**
     * Retrieves the current drivers for the season.
     * 
     * @return List of current drivers
     */
    public List<Driver> getCurrentDrivers() {
        Map<String, String> driverMap = fastF1.getCurrentDriversId();
        List<Driver> drivers = new ArrayList<>();
        for (String driverNumber : driverMap.keySet()) {
            String fullName = driverMap.get(driverNumber);
            Driver driver = driverRepo.findDriverByDriverNumberAndFullName(driverNumber, fullName);
            drivers.add(driver);
        }
        return drivers;
    }

    /**
     * Retrieves all races for the current year.
     * 
     * @return List of races for the current year
     */
    public List<Race> getRacesOfCurrentYear() {
        return raceRepo.findAll();
    }

    /**
     * Retrieves a specific driver by ID.
     * 
     * @param driverId The ID of the driver to retrieve
     * @return The driver with the specified ID, or null if not found
     */
    public Driver getDriverById(String driverId) {
        return driverRepo.findById(driverId).orElse(null);
    }


    public List<Map<String, String>> getResultsByYearAndByRound(String year, String round) {
        return fastF1.getResultsByYearAndByRound(year, round);
    }

    public Race getRaceById(String id){
        return raceRepo.findById(id).get();
    }

}