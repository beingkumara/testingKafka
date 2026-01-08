package com.f1nity.engine.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f1nity.engine.client.ErgastClient;
import com.f1nity.engine.service.DataIngestionService;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.FastestLap;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.RaceResponse;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.repository.authentication.UserRepository;
import com.f1nity.library.repository.engine.DriverRepository;
import com.f1nity.library.repository.engine.RaceRepository;
import com.f1nity.library.models.engine.Constructor;
import com.f1nity.library.repository.engine.ConstructorRepository;
import com.f1nity.library.repository.engine.DriverStandingsRepository;
import com.f1nity.library.repository.engine.ConstructorStandingsRepository;
import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ConstructorStanding;
import org.springframework.data.domain.Sort;

import reactor.core.publisher.Mono;

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
    private ErgastClient ergastClient;

    @Autowired
    private DriverStandingsRepository driverStandingsRepo;

    @Autowired
    private ConstructorStandingsRepository constructorStandingsRepo;

    @Autowired
    private ConstructorRepository constructorRepo;

    /**
     * Retrieves the current drivers for the season.
     * 
     * @return List of current drivers
     */
    public List<Driver> getCurrentDrivers() {
        return driverRepo.findDriverByIsActive(true);
    }

    public List<Driver> getAllDrivers() {
        return driverRepo.findAll();
    }

    public List<Constructor> getAllConstructors() {
        return constructorRepo.findAll();
    }

    /**
     * Retrieves all races for the current year.
     * 
     * @return List of races for the current year
     */
    public List<Race> getRacesOfCurrentYear() {
        return raceRepo.findBySeason("2026");
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
        // Copied logic from FastF1
        Mono<RaceResponse> response = ergastClient.getRaceResultsMono(year, round);
        RaceResponse raceResponse = response.block();

        if (raceResponse != null && raceResponse.getMrData() != null
                && raceResponse.getMrData().getRaceTable() != null) {
            List<Race> races = raceResponse.getMrData().getRaceTable().getRaces();
            if (races != null && !races.isEmpty()) {
                String circuitName = races.get(0).getRaceName();
                List<Result> results = races.get(0).getResults();
                List<Map<String, String>> updatedResults = new ArrayList<>();
                Map<String, String> detailsMap = new HashMap<>();
                LocalDate date = LocalDate.parse(races.get(0).getDate());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH);
                String formattedDate = date.format(formatter);
                detailsMap.put("date", formattedDate);
                detailsMap.put("circuit", circuitName);
                updatedResults.add(detailsMap);
                FastestLap fastestLap = null;
                for (Result result : results) {
                    Map<String, String> resultMap = new HashMap<>();
                    resultMap.put("position", result.getPosition());
                    resultMap.put("driver",
                            result.getDriver().getGivenName() + " " + result.getDriver().getFamilyName());
                    resultMap.put("constructor", result.getConstructor().getName());
                    resultMap.put("points", result.getPoints());
                    resultMap.put("time", result.getTime() != null ? result.getTime().getTime() : result.getStatus());
                    if (result.getFastestLap() != null && result.getFastestLap().getRank().equals("1")) {
                        fastestLap = result.getFastestLap();
                        if (fastestLap.getTime() != null) {
                            resultMap.put("fastestLap", fastestLap.getTime().getTime());
                        } else {
                            resultMap.put("fastestLap", "N/A");
                        }
                    } else {
                        resultMap.put("fastestLap", "N/A");
                    }

                    updatedResults.add(resultMap);
                }
                return updatedResults;
            }
        }
        return Collections.emptyList();
    }

    public Race getRaceById(String id) {
        return raceRepo.findById(id).orElse(null);
    }

    public List<DriverStanding> getDriverStandings() {
        return driverStandingsRepo.findAll(Sort.by(Sort.Order.asc("position")));
    }

    public List<ConstructorStanding> getConstructorStandings() {
        return constructorStandingsRepo.findAll(Sort.by(Sort.Order.asc("position")));
    }
}