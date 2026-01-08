package com.f1nity.engine.service;

import java.time.LocalDate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.f1nity.engine.client.ErgastClient;
import com.f1nity.engine.client.OpenF1Client;
import com.f1nity.library.models.engine.Constructor;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ErgastConstructor;
import com.f1nity.library.models.engine.ErgastConstructor.ConstructorResponse;
import com.f1nity.library.models.engine.ErgastConstructorStandingsResponse;
import com.f1nity.library.models.engine.ErgastDriver;
import com.f1nity.library.models.engine.ErgastDriver.ErgastResponse;
import com.f1nity.library.models.engine.ErgastDriverStandingsResponse;

import com.f1nity.library.models.engine.OpenF1Driver;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.RaceResponse;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.repository.engine.ConstructorRepository;
import com.f1nity.library.repository.engine.ConstructorStandingsRepository;
import com.f1nity.library.repository.engine.DriverRepository;
import com.f1nity.library.repository.engine.DriverStandingsRepository;
import com.f1nity.library.repository.engine.RaceRepository;

@Service
public class DataIngestionService {

    private final Integer MAX_ROUNDS = 24;

    private static final Map<String, String> OPENF1_TO_ERGAST_NAME_MAP = new HashMap<>();
    private static final Map<String, String> DRIVER_IMAGE_OVERRIDES = new HashMap<>();
    private static final Set<String> DRIVERS_2026 = new HashSet<>();

    static {
        // Map OpenF1 names (uppercase) to Ergast names (uppercase)
        OPENF1_TO_ERGAST_NAME_MAP.put("KIMI ANTONELLI", "ANDREA KIMI ANTONELLI");
        OPENF1_TO_ERGAST_NAME_MAP.put("NICO HULKENBERG", "NICO HÜLKENBERG");
        OPENF1_TO_ERGAST_NAME_MAP.put("SERGIO PEREZ", "SERGIO PÉREZ");
        OPENF1_TO_ERGAST_NAME_MAP.put("KEVIN MAGNUSSEN", "KEVIN MAGNUSSEN"); // Seems ok but for safety
        OPENF1_TO_ERGAST_NAME_MAP.put("VALTTERI BOTTAS", "VALTTERI BOTTAS");

        // High resolution image overrides
        DRIVER_IMAGE_OVERRIDES.put("ANDREA KIMI ANTONELLI",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Andrea_Kimi_Antonelli_%282024_Macau_Grand_Prix%29.jpg/640px-Andrea_Kimi_Antonelli_%282024_Macau_Grand_Prix%29.jpg");
        DRIVER_IMAGE_OVERRIDES.put("NICO HÜLKENBERG",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Nico_H%C3%BClkenberg_2019_Malaysia.jpg/640px-Nico_H%C3%BClkenberg_2019_Malaysia.jpg");

        // 2026 Confirmed Driver Lineup
        DRIVERS_2026.add("LANDO NORRIS");
        DRIVERS_2026.add("OSCAR PIASTRI");
        DRIVERS_2026.add("GEORGE RUSSELL");
        DRIVERS_2026.add("ANDREA KIMI ANTONELLI");
        DRIVERS_2026.add("MAX VERSTAPPEN");
        DRIVERS_2026.add("ISACK HADJAR");
        DRIVERS_2026.add("CHARLES LECLERC");
        DRIVERS_2026.add("LEWIS HAMILTON");
        DRIVERS_2026.add("ALEX ALBON");
        DRIVERS_2026.add("CARLOS SAINZ");
        DRIVERS_2026.add("LIAM LAWSON");
        DRIVERS_2026.add("ARVID LINDBLAD");
        DRIVERS_2026.add("FERNANDO ALONSO");
        DRIVERS_2026.add("LANCE STROLL");
        DRIVERS_2026.add("PIERRE GASLY");
        DRIVERS_2026.add("FRANCO COLAPINTO");
        DRIVERS_2026.add("ESTEBAN OCON");
        DRIVERS_2026.add("OLLIE BEARMAN"); // Check if name matches Ergast/OpenF1 exactly, usually OLIVER BEARMAN
        DRIVERS_2026.add("OLIVER BEARMAN"); // Adding both just in case
        DRIVERS_2026.add("NICO HÜLKENBERG");
        DRIVERS_2026.add("NICO HULKENBERG"); // Variation
        DRIVERS_2026.add("GABRIEL BORTOLETO");
        DRIVERS_2026.add("SERGIO PÉREZ");
        DRIVERS_2026.add("SERGIO PEREZ"); // Variation
        DRIVERS_2026.add("VALTTERI BOTTAS");
    }

    @Autowired
    private ErgastClient ergastClient;

    @Autowired
    private OpenF1Client openF1Client;

    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private ConstructorRepository constructorRepo;

    @Autowired
    private DriverStandingsRepository driverStandingsRepo;

    @Autowired
    private ConstructorStandingsRepository constructorStandingsRepo;

    @Autowired
    private RaceRepository raceRepo;

    @Autowired
    private HistoricalDataLoader historicalDataLoader;

    public void initializeStaticData() {
        // Check for forced reset environment variable
        String forceReset = System.getenv("FORCE_RESET_DATA");
        if ("true".equalsIgnoreCase(forceReset)) {
            System.out.println("FORCE_RESET_DATA is true. Resetting database...");
            resetDatabase();
        }

        // Try loading from JSON first
        if (driverRepo.count() == 0 || constructorRepo.count() == 0) {
            System.out.println("Empty database detected. Attempting to load from historical_data.json...");
            historicalDataLoader.loadHistoricalData();
        }

        // Removed API fallback as requested. We strictly rely on JSON for historical
        // baseline.
        if (driverRepo.count() > 0) {
            updateDriverActiveStatus();
        }
    }

    public void updateDriverActiveStatus() {
        System.out.println("Updating driver active status based on 2026 lineup...");
        List<Driver> allDrivers = driverRepo.findAll();
        for (Driver d : allDrivers) {
            if (DRIVERS_2026.contains(d.getFullName().toUpperCase())) {
                d.setActive(true);
            } else {
                d.setActive(false);
            }
        }
        driverRepo.saveAll(allDrivers);
        System.out.println("Updated active status for " + allDrivers.size() + " drivers.");
    }

    @Autowired
    private com.f1nity.library.repository.engine.FailedRequestRepository failedRequestRepo;

    public void updateStatistics() {
        Integer year = 2026;
        Integer round = 1;

        // Note: Global reset removed to support incremental JSON updates + new race
        // additions.
        // We assume historical data is loaded from JSON.

        // Only check for current season (or future seasons)
        while (year >= 2026) {
            while (round <= MAX_ROUNDS) {
                String context = "year " + year + ", round " + round;

                // First check if we already have this race processed to avoid unnecessary API
                // calls
                List<Race> existingRaces = raceRepo.findBySeasonAndRound(String.valueOf(year), String.valueOf(round));
                if (existingRaces != null && !existingRaces.isEmpty()) {
                    System.out.println("Race " + context + " already exists. Skipping accumulation.");
                    round++;
                    continue;
                }

                try {
                    // Check for nulls/empty responses without exception flow where possible
                    RaceResponse raceResponse = null;
                    try {
                        raceResponse = ergastClient.getRaceResults(year, round);
                    } catch (Exception e) {
                        System.err.println("Error fetching race results for " + context + ": " + e.getMessage());
                        saveFailedRequest(year, String.valueOf(round), "race", e.getMessage());
                        round++;
                        continue;
                    }

                    if (raceResponse == null || raceResponse.getMrData() == null ||
                            raceResponse.getMrData().getRaceTable() == null ||
                            raceResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                        System.out.println("No race data for " + context);
                        round++;
                        try {
                            Thread.sleep(200);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                        continue;
                    }

                    Race race = raceResponse.getMrData().getRaceTable().getRaces().get(0);
                    String circuitId = race.getCircuit().getCircuitId();
                    List<Result> results = race.getResults();

                    if (results == null || results.isEmpty()) {
                        System.out.println("No results in race data for " + context);
                        round++;
                        continue;
                    }

                    // ... Quali logic ...(rest of function)
                    RaceResponse qualiResponse = null;
                    try {
                        qualiResponse = ergastClient.getQualifyingResults(year, round);
                    } catch (Exception e) {
                        System.err.println("Error fetching quali results for " + context + ": " + e.getMessage());
                    }

                    List<Result> qualiResults = Collections.emptyList();
                    if (qualiResponse != null && qualiResponse.getMrData() != null &&
                            qualiResponse.getMrData().getRaceTable() != null &&
                            !qualiResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                        Race qualiRace = qualiResponse.getMrData().getRaceTable().getRaces().get(0);
                        if (qualiRace.getQualifyingResults() != null) {
                            qualiResults = qualiRace.getQualifyingResults();
                        }
                    }

                    Map<String, Driver> updatedDrivers = new HashMap<>();
                    Map<String, Constructor> updatedConstructors = new HashMap<>();
                    Map<String, DriverStanding> updatedDriverStandings = new HashMap<>();
                    Map<String, ConstructorStanding> updatedConstructorStandings = new HashMap<>();
                    Set<String> constructorsProcessedForTotalRaces = new HashSet<>();
                    Map<String, Race> updateRaces = new HashMap<>();
                    String currentRound = race.getRound();

                    // Process race results
                    // Since we already checked for existence at the top, we just process here.
                    // But for safety, we set standingsUpdated
                    race.setStandingsUpdated(true);
                    updateRaces.put(currentRound, race);

                    for (int i = 0; i < results.size(); i++) {
                        processResultForStats(year, context, updatedDrivers, updatedConstructors,
                                updatedDriverStandings, updatedConstructorStandings,
                                constructorsProcessedForTotalRaces, i, results.get(i), false);
                    }

                    // Process Sprint Results
                    if (year >= 2021) {
                        try {
                            RaceResponse sprintResponse = ergastClient.getSprintResults(year, round);
                            if (sprintResponse != null && sprintResponse.getMrData() != null &&
                                    sprintResponse.getMrData().getRaceTable() != null &&
                                    !sprintResponse.getMrData().getRaceTable().getRaces().isEmpty()) {

                                Race sprintRace = sprintResponse.getMrData().getRaceTable().getRaces().get(0);
                                List<Result> sprintResults = sprintRace.getSprintResults();

                                if (sprintResults != null && !sprintResults.isEmpty()) {
                                    System.out.println("Processing Sprint results for " + context);
                                    for (int s = 0; s < sprintResults.size(); s++) {
                                        processResultForStats(year, context + " (Sprint)", updatedDrivers,
                                                updatedConstructors,
                                                year == 2026 ? updatedDriverStandings : null,
                                                year == 2026 ? updatedConstructorStandings : null,
                                                constructorsProcessedForTotalRaces, s, sprintResults.get(s), true);
                                    }
                                }
                            }
                        } catch (Exception e) {
                            System.err
                                    .println("Error processing sprint results for " + context + ": " + e.getMessage());
                            saveFailedRequest(year, String.valueOf(round), "sprint", e.getMessage());
                        }
                    }

                    // Process Quali (Poles) - existing logic
                    if (qualiResults != null && !qualiResults.isEmpty()) {
                        Result poleResult = qualiResults.get(0);
                        if (poleResult.getPosition() != null && poleResult.getPosition().equals("1")) {
                            ErgastDriver ergDriver = poleResult.getDriver();
                            ErgastConstructor egConstructor = poleResult.getConstructor();
                            if (ergDriver != null && egConstructor != null) {
                                String driverId = ergDriver.getDriverId();
                                String constructorId = egConstructor.getConstructorId();

                                Driver driver = updatedDrivers.computeIfAbsent(driverId,
                                        k -> driverRepo.findById(k).orElse(null));
                                Constructor constructor = updatedConstructors.computeIfAbsent(constructorId,
                                        k -> constructorRepo.findById(k).orElse(null));

                                if (driver != null && constructor != null) {
                                    driver.setPoles(driver.getPoles() + 1);
                                    constructor.setPolePositions(constructor.getPolePositions() + 1);
                                }
                            }
                        }
                    }

                    if (!updatedDrivers.isEmpty())
                        driverRepo.saveAll(updatedDrivers.values());
                    if (!updatedConstructors.isEmpty())
                        constructorRepo.saveAll(updatedConstructors.values());
                    if (year == 2026) {
                        if (!updatedDriverStandings.isEmpty())
                            driverStandingsRepo.saveAll(updatedDriverStandings.values());
                        if (!updatedConstructorStandings.isEmpty())
                            constructorStandingsRepo.saveAll(updatedConstructorStandings.values());
                        if (!updateRaces.isEmpty())
                            raceRepo.saveAll(updateRaces.values());
                    }

                    System.out.println("Successfully processed " + context);

                } catch (Exception e) {
                    System.err.println("General error processing " + context + ": " + e.getMessage());
                    saveFailedRequest(year, String.valueOf(round), "general", e.getMessage());
                    e.printStackTrace();
                }

                round++;
                // Polite delay
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            year--;
            round = 1;
            // Removed the massive 60s sleep to prevent connection drops.
            // ErgastClient has its own rate limiting logic if we hit 429.
            System.out.println("Finished processing year " + (year + 1) + ". Moving to " + year);
        }
        // Update JSON file after bulk update
        historicalDataLoader.exportDataToJSON();
    }

    private void saveFailedRequest(int year, String round, String type, String msg) {
        try {
            com.f1nity.library.models.engine.FailedRequest fr = new com.f1nity.library.models.engine.FailedRequest(year,
                    String.valueOf(round), type, msg);
            failedRequestRepo.save(fr);
        } catch (Exception e) {
            System.err.println("Could not save failed request: " + e.getMessage());
        }
    }

    private void processResultForStats(Integer year, String context, Map<String, Driver> updatedDrivers,
            Map<String, Constructor> updatedConstructors, Map<String, DriverStanding> updatedDriverStandings,
            Map<String, ConstructorStanding> updatedConstructorStandings,
            Set<String> constructorsProcessedForTotalRaces, int i, Result result, boolean isSprint) {

        ErgastDriver ergDriver = result.getDriver();
        ErgastConstructor egConstructor = result.getConstructor();

        if (ergDriver == null || egConstructor == null)
            return;

        String driverId = ergDriver.getDriverId();
        String constructorId = egConstructor.getConstructorId();

        Driver driver = updatedDrivers.computeIfAbsent(driverId, k -> driverRepo.findById(k).orElse(new Driver()));
        Constructor constructor = updatedConstructors.computeIfAbsent(constructorId,
                k -> constructorRepo.findById(k).orElse(new Constructor()));

        if (driver == null || constructor == null)
            return;

        // Update basic stats
        if (!isSprint) {
            // Main Race Stats
            if (i == 0) { // Winner
                driver.setWins(driver.getWins() + 1);
                driver.setPodiums(driver.getPodiums() + 1);
                constructor.setWins(constructor.getWins() + 1);
                constructor.setPodiums(constructor.getPodiums() + 1);
            } else if (i < 3) { // Podium
                driver.setPodiums(driver.getPodiums() + 1);
                constructor.setPodiums(constructor.getPodiums() + 1);
            }
        }

        // Points (Sprint + Main)
        if (result.getPoints() != null && !result.getPoints().isEmpty()) {
            try {
                double points = Double.parseDouble(result.getPoints());
                driver.setPoints(driver.getPoints() + points);
                constructor.setPoints(constructor.getPoints() + points);
            } catch (NumberFormatException e) {
            }
        }

        // Fastest Lap (Main Only usually)
        if (!isSprint && result.getFastestLap() != null && result.getFastestLap().getRank() != null &&
                result.getFastestLap().getRank().equals("1")) {
            driver.setFastestLaps(driver.getFastestLaps() != null ? driver.getFastestLaps() + 1 : 1);
            constructor.setFastestLaps(constructor.getFastestLaps() != null ? constructor.getFastestLaps() + 1 : 1);
        }

        // Total Races - FIXED: Include Sprints
        driver.setTotalRaces(driver.getTotalRaces() != null ? driver.getTotalRaces() + 1 : 1);

        if (!isSprint) {
            if (!constructorsProcessedForTotalRaces.contains(constructorId)) {
                constructor.setTotalRaces(constructor.getTotalRaces() != null ? constructor.getTotalRaces() + 1 : 1);
                constructorsProcessedForTotalRaces.add(constructorId);
            }
        } else {
            // Sprint Specific Stats
            driver.setSprintRaces(driver.getSprintRaces() != null ? driver.getSprintRaces() + 1 : 1);
            if (i == 0) { // Sprint Winner
                driver.setSprintWins(driver.getSprintWins() != null ? driver.getSprintWins() + 1 : 1);
                driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
            } else if (i < 3) { // Sprint Podium
                driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
            }
        }

        // Update Standings (2026 only)
        if (year == 2026 && updatedDriverStandings != null && updatedConstructorStandings != null) {
            DriverStanding driverStanding = updatedDriverStandings.computeIfAbsent(driverId, k -> {
                DriverStanding ds = new DriverStanding();
                ds.setDriverId(driverId);
                ds.setFullName(driver.getFullName());
                ds.setTeamName(constructor.getName());
                ds.setPoints(0.0);
                ds.setWins(0);
                ds.setPodiums(0);
                ds.setPosition(0);
                return ds;
            });
            ConstructorStanding constructorStanding = updatedConstructorStandings.computeIfAbsent(constructorId, k -> {
                ConstructorStanding cs = new ConstructorStanding();
                cs.setConstructorId(constructorId);
                cs.setName(constructor.getName());
                cs.setPoints(0.0);
                cs.setWins(0);
                cs.setPodiums(0);
                cs.setPosition(0);
                return cs;
            });

            if (!isSprint) {
                if (i == 0) {
                    driverStanding.setWins(driverStanding.getWins() + 1);
                    driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                    constructorStanding.setWins(constructorStanding.getWins() + 1);
                    constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                } else if (i < 3) {
                    driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                    constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                }
            }
            double pointsVal = 0.0;
            if (result.getPoints() != null) {
                try {
                    pointsVal = Double.parseDouble(result.getPoints());
                } catch (Exception e) {
                }
            }
            driverStanding.setPoints(driverStanding.getPoints() + pointsVal);
            constructorStanding.setPoints(constructorStanding.getPoints() + pointsVal);
        }
    }

    /**
     * Dummy API to fix Sprint Logic specifically.
     * Iterates 2021-2026 and adds missing sprint stats.
     */

    public String updateStandings() {
        // Driver Standings
        try {
            ErgastDriverStandingsResponse driverResponse = ergastClient.getDriverStandings(2026);
            if (driverResponse != null && driverResponse.MRData != null &&
                    driverResponse.MRData.StandingsTable != null &&
                    !driverResponse.MRData.StandingsTable.StandingsLists.isEmpty()) {

                List<ErgastDriverStandingsResponse.DriverStanding> driverStandings = driverResponse.MRData.StandingsTable.StandingsLists
                        .get(0).DriverStandings;
                List<DriverStanding> updatedDriverStandings = new ArrayList<>();

                for (ErgastDriverStandingsResponse.DriverStanding standing : driverStandings) {
                    String driverId = standing.Driver.getDriverId();
                    Optional<Driver> driverOpt = driverRepo.findById(driverId);
                    if (driverOpt.isEmpty())
                        continue;

                    DriverStanding ds = new DriverStanding();
                    ds.setDriverId(driverId);
                    ds.setFullName(driverOpt.get().getFullName());
                    ds.setTeamName(!standing.Constructors.isEmpty() ? standing.Constructors.get(0).getName() : "");
                    ds.setPosition(Integer.parseInt(standing.position));
                    ds.setPoints(Double.parseDouble(standing.points));
                    ds.setWins(Integer.parseInt(standing.wins));

                    Optional<DriverStanding> prevStanding = driverStandingsRepo.findById(driverId);
                    if (prevStanding.isPresent()) {
                        ds.setPositionsMoved(ds.getPosition() - prevStanding.get().getPosition());
                    } else {
                        ds.setPositionsMoved(0);
                    }
                    updatedDriverStandings.add(ds);
                }

                if (!updatedDriverStandings.isEmpty()) {
                    driverStandingsRepo.deleteAll();
                    driverStandingsRepo.saveAll(updatedDriverStandings);
                }
            }

            // Constructor Standings
            ErgastConstructorStandingsResponse constructorResponse = ergastClient.getConstructorStandings(2026);
            if (constructorResponse != null && constructorResponse.MRData != null &&
                    constructorResponse.MRData.StandingsTable != null &&
                    !constructorResponse.MRData.StandingsTable.StandingsLists.isEmpty()) {

                List<ErgastConstructorStandingsResponse.ConstructorStanding> constructorStandings = constructorResponse.MRData.StandingsTable.StandingsLists
                        .get(0).ConstructorStandings;
                List<ConstructorStanding> updatedConstructorStandings = new ArrayList<>();
                Set<String> processed = new HashSet<>();

                for (ErgastConstructorStandingsResponse.ConstructorStanding standing : constructorStandings) {
                    String id = standing.Constructor.getConstructorId();
                    if (processed.contains(id))
                        continue;
                    processed.add(id);

                    Optional<Constructor> cOpt = constructorRepo.findById(id);
                    if (cOpt.isEmpty())
                        continue;

                    ConstructorStanding cs = new ConstructorStanding();
                    cs.setConstructorId(id);
                    cs.setName(cOpt.get().getName());
                    cs.setColor(cOpt.get().getColorCode());
                    cs.setPosition(Integer.parseInt(standing.position));
                    cs.setPoints(Double.parseDouble(standing.points));
                    cs.setWins(Integer.parseInt(standing.wins));

                    Optional<ConstructorStanding> prev = constructorStandingsRepo.findById(id);
                    if (prev.isPresent()) {
                        cs.setPositionsMoved(cs.getPosition() - prev.get().getPosition());
                    } else {
                        cs.setPositionsMoved(0);
                    }
                    updatedConstructorStandings.add(cs);
                }

                if (!updatedConstructorStandings.isEmpty()) {
                    constructorStandingsRepo.deleteAll();
                    constructorStandingsRepo.saveAll(updatedConstructorStandings);
                }
            }
            return "Successfully updated standings";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public List<Race> accumulateRaces() {
        RaceResponse response = ergastClient.getRaces(2026);
        if (response != null && response.getMrData() != null) {
            List<Race> races = response.getMrData().getRaceTable().getRaces();
            List<Race> savedRaces = new ArrayList<>();
            for (Race r : races) {
                // Upsert logic to prevent duplicates
                List<Race> existing = raceRepo.findBySeasonAndRound(r.getSeason(), r.getRound());
                if (existing != null && !existing.isEmpty()) {
                    Race current = existing.get(0);
                    // Cleanup potential duplicates
                    if (existing.size() > 1) {
                        for (int j = 1; j < existing.size(); j++) {
                            raceRepo.delete(existing.get(j));
                        }
                    }
                    current.setDate(r.getDate());
                    current.setTime(r.getTime());
                    current.setRaceName(r.getRaceName());
                    current.setCircuit(r.getCircuit());
                    current.setUrl(r.getUrl());
                    // Copy other fields if necessary
                    savedRaces.add(raceRepo.save(current));
                } else {
                    savedRaces.add(raceRepo.save(r));
                }
            }
            return savedRaces;
        }
        return Collections.emptyList();
    }

    public Map<String, String> getCurrentDriversId() {
        OpenF1Driver[] currDrivers = openF1Client.getSessionDrivers("latest", "latest").block();
        Map<String, String> driverMapping = new HashMap<>();
        if (currDrivers != null) {
            for (OpenF1Driver od : currDrivers) {
                driverMapping.put(od.getDriverNumber(), od.getFullName().toUpperCase());
            }
        }
        return driverMapping;
    }

    @Transactional
    public List<Result> fetchAndStoreLatestRaceResults(String yearStr, String round) {
        int year = Integer.parseInt(yearStr);
        System.out.println("Fetching race results for year " + year + ", round " + round);

        try {
            RaceResponse raceResponse = ergastClient.getRaceResults(year, round);

            if (raceResponse == null || raceResponse.getMrData() == null ||
                    raceResponse.getMrData().getRaceTable() == null ||
                    raceResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                System.out.println("No race data found for round " + round);
                return Collections.emptyList();
            }

            Race fetchedRace = raceResponse.getMrData().getRaceTable().getRaces().get(0);
            List<Result> results = fetchedRace.getResults();

            if (results == null || results.isEmpty()) {
                System.out.println("No results found for round " + round);
                return Collections.emptyList();
            }

            // Update Race entity
            List<Race> existingRaces = raceRepo.findBySeasonAndRound(String.valueOf(year), round);
            Race existingRace = null;

            if (existingRaces != null && !existingRaces.isEmpty()) {
                existingRace = existingRaces.get(0);
                if (existingRaces.size() > 1) {
                    for (int k = 1; k < existingRaces.size(); k++) {
                        raceRepo.delete(existingRaces.get(k));
                    }
                }
                existingRace.setResults(results);
                existingRace.setStandingsUpdated(true);
                raceRepo.save(existingRace);
            } else {
                fetchedRace.setStandingsUpdated(true);
                raceRepo.save(fetchedRace);
                existingRace = fetchedRace;
            }

            // Prepare maps for stats updates
            Map<String, Driver> updatedDrivers = new HashMap<>();
            Map<String, Constructor> updatedConstructors = new HashMap<>();

            // Note: For live updates, we might ideally want to fetch current standings
            // state if we were doing incremental.
            // But since our stats logic is "recalculate all or add to current", and
            // processResultForStats
            // ADDS to the driver object provided.
            // So we fetch the current state of drivers/constructors from DB.

            // However, processResultForStats expects us to pre-populate the maps with the
            // DB entities
            // OR it tries to find them. The method signature:
            // processResultForStats(..., Map<String, Driver> updatedDrivers, ...)
            // checks the map first, then the repo.
            // So we can pass empty maps and let it fetch/update.

            Map<String, DriverStanding> updatedDriverStandings = new HashMap<>();
            Map<String, ConstructorStanding> updatedConstructorStandings = new HashMap<>();
            Set<String> constructorsProcessedForTotalRaces = new HashSet<>();

            String context = "Live Update " + year + " Round " + round;

            // Process Main Race
            for (int i = 0; i < results.size(); i++) {
                processResultForStats(year, context, updatedDrivers, updatedConstructors,
                        updatedDriverStandings, updatedConstructorStandings,
                        constructorsProcessedForTotalRaces, i, results.get(i), false);
            }

            // Process Sprint if available
            try {
                RaceResponse sprintResponse = ergastClient.getSprintResults(year, round);
                if (sprintResponse != null && sprintResponse.getMrData() != null &&
                        sprintResponse.getMrData().getRaceTable() != null &&
                        !sprintResponse.getMrData().getRaceTable().getRaces().isEmpty()) {

                    Race sprintRace = sprintResponse.getMrData().getRaceTable().getRaces().get(0);
                    List<Result> sprintResults = sprintRace.getSprintResults();

                    if (sprintResults != null && !sprintResults.isEmpty()) {
                        System.out.println("Processing Sprint results for " + context);
                        for (int s = 0; s < sprintResults.size(); s++) {
                            processResultForStats(year, context + " (Sprint)", updatedDrivers,
                                    updatedConstructors,
                                    updatedDriverStandings, updatedConstructorStandings,
                                    constructorsProcessedForTotalRaces, s, sprintResults.get(s), true);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error processing sprint results in live update: " + e.getMessage());
            }

            // SAVE UPDATES
            if (!updatedDrivers.isEmpty()) {
                driverRepo.saveAll(updatedDrivers.values());
            }
            if (!updatedConstructors.isEmpty()) {
                constructorRepo.saveAll(updatedConstructors.values());
            }
            if (!updatedDriverStandings.isEmpty()) {
                // For standings, typically we replace or update.
                // Logic in updateStandings() (the bulk one) replaces ALL.
                // Here we are adding points.
                // Actually, processResultForStats ALSO updates standings maps if year==2026.
                // But wait, processResultForStats adds points to 0 if new object.
                // The Standings objects created in processResultForStats are `new
                // DriverStanding()`.
                // They don't fetch existing standings.
                // This is a flaw in trying to reuse processResultForStats for INCREMENTAL
                // updates if it assumes full recalc.

                // Let's check processResultForStats implementation again:
                // DriverStanding driverStanding = updatedDriverStandings.computeIfAbsent(...,
                // new DriverStanding()... setPoints(0))

                // YES, processResultForStats assumes it's building from scratch for that
                // session.
                // So if we run this for just ONE race, it calculates points ONLY for that race.
                // It does NOT add to existing career total in the Standing object (it operates
                // on a fresh object).
                // BUT for Driver/Constructor entities, it DOES fetch from repo:
                // updatedDrivers.putIfAbsent(driverId, driver) -> where driver comes from repo.

                // SO:
                // Driver/Constructor Entities: SAFE (Cumulative).
                // Standings Entities: UNSAFE (Would overwrite with single-race points if we
                // blindly save).

                // HOWEVER, we have a separate method `updateStandings()` that fetches full
                // standings from Ergast API.
                // And `RaceDataScheduler` calls `updateStandings()` immediately after
                // `fetchAndStoreLatestRaceResults`.
                // So we don't strictly need to update Standings HERE manually.
                // We can rely on `updateStandings()` to sync the official table.

                // BUT `updateStandings` fetches from Ergast. If Ergast hasn't updated its
                // standings endpoint yet (latency),
                // we might be ahead.
                // But typically, if results are out, standings are out.

                // Given the complexity of incremental standings update (calculating positions
                // etc),
                // it's safer to rely on the `updateStandings` call which uses the official
                // source.
                // So we can IGNORE updatedDriverStandings here.
            }

            // Sync to JSON file after live update
            historicalDataLoader.exportDataToJSON();

            return results;

        } catch (Exception e) {
            System.err.println("Error processing latest race results: " + e.getMessage());
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

    public List<Result> getLatestRaceResults() {
        List<Race> races = raceRepo.findAll();
        String currentDate = LocalDate.now().toString();
        Race latestRaceWithResults = null;
        int maxRound = -1;

        for (Race race : races) {
            if (race.getResults() != null && !race.getResults().isEmpty() &&
                    race.getDate() != null && race.getDate().compareTo(currentDate) <= 0) {

                int currentRound = 0;
                try {
                    currentRound = Integer.parseInt(race.getRound());
                } catch (NumberFormatException e) {
                    continue;
                }

                if (currentRound > maxRound) {
                    maxRound = currentRound;
                    latestRaceWithResults = race;
                }
            }
        }

        if (latestRaceWithResults != null) {
            List<Result> results = latestRaceWithResults.getResults();
            // Populate transient fields for UI display
            for (Result result : results) {
                result.setRaceName(latestRaceWithResults.getRaceName());
                result.setDate(latestRaceWithResults.getDate());
            }
            return results;
        } else {
            // Fallback to fetch if not found
            // return fetchAndStoreLatestRaceResults(null);
            return Collections.emptyList();
        }
    }

    public void updateCircuitUrls() {
        Map<String, String> circuitImages = new HashMap<>();
        // 2025 Calendar Circuit Images (Wikimedia/Public Domain)
        circuitImages.put("albert_park",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Albert_Park_Circuit_2021.png/640px-Albert_Park_Circuit_2021.png");
        circuitImages.put("bahrain",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg/640px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png");
        circuitImages.put("jeddah",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jeddah_Corniche_Circuit_2021.svg/640px-Jeddah_Corniche_Circuit_2021.svg.png");
        circuitImages.put("suzuka",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Suzuka_circuit_map--2005.svg/640px-Suzuka_circuit_map--2005.svg.png");
        circuitImages.put("shanghai",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Shanghai_International_Racing_Circuit_track_map.svg/640px-Shanghai_International_Racing_Circuit_track_map.svg.png");
        circuitImages.put("miami",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Miami_International_Autodrome_2022.svg/640px-Miami_International_Autodrome_2022.svg.png");
        circuitImages.put("imola",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Imola_2021.svg/640px-Imola_2021.svg.png");
        circuitImages.put("monaco",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Circuit_de_Monaco_2021.svg/640px-Circuit_de_Monaco_2021.svg.png");
        circuitImages.put("catalunya",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Catalunya_2021.svg/640px-Catalunya_2021.svg.png");
        circuitImages.put("red_bull_ring",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Red_Bull_Ring_2022.svg/640px-Red_Bull_Ring_2022.svg.png");
        circuitImages.put("silverstone",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Silverstone_Circuit_2021.svg/640px-Silverstone_Circuit_2021.svg.png");
        circuitImages.put("hungaroring",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hungaroring_2021.svg/640px-Hungaroring_2021.svg.png");
        circuitImages.put("spa",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Spa-Francorchamps_of_Belgium.svg/640px-Spa-Francorchamps_of_Belgium.svg.png");
        circuitImages.put("zandvoort",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Zandvoort_Circuit_2021.svg/640px-Zandvoort_Circuit_2021.svg.png");
        circuitImages.put("monza",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Monza_track_map.svg/640px-Monza_track_map.svg.png");
        circuitImages.put("baku",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Baku_Formula_One_circuit_map.svg/640px-Baku_Formula_One_circuit_map.svg.png");
        circuitImages.put("singapore",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marina_Bay_Street_Circuit_2021.svg/640px-Marina_Bay_Street_Circuit_2021.svg.png");
        circuitImages.put("americas",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/640px-Austin_circuit.svg.png");
        circuitImages.put("rodriguez",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg/640px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg.png");
        circuitImages.put("interlagos",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Interlagos_2014.svg/640px-Interlagos_2014.svg.png");
        circuitImages.put("las_vegas",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Las_Vegas_Strip_Street_Circuit_2023.svg/640px-Las_Vegas_Strip_Street_Circuit_2023.svg.png");
        circuitImages.put("losail",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Losail_International_Circuit_2021.svg/640px-Losail_International_Circuit_2021.svg.png");
        circuitImages.put("yas_marina",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Yas_Marina_Circuit_2021.svg/640px-Yas_Marina_Circuit_2021.svg.png");
        circuitImages.put("las_vegas",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Las_Vegas_Strip_Street_Circuit_2023.svg/640px-Las_Vegas_Strip_Street_Circuit_2023.svg.png");
        circuitImages.put("miami",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Miami_International_Autodrome_2022.svg/640px-Miami_International_Autodrome_2022.svg.png");
        circuitImages.put("jeddah",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jeddah_Corniche_Circuit_2021.svg/640px-Jeddah_Corniche_Circuit_2021.svg.png");
        circuitImages.put("qatar",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Losail_International_Circuit_2021.svg/640px-Losail_International_Circuit_2021.svg.png");

        List<Race> races = raceRepo.findAll();
        for (Race race : races) {
            if (race.getCircuit() != null && circuitImages.containsKey(race.getCircuit().getCircuitId())) {
                race.setCircuitImageUrl(circuitImages.get(race.getCircuit().getCircuitId()));
            }
        }
        raceRepo.saveAll(races);
        System.out.println("Updated circuit images for " + races.size() + " races.");
    }

    public void updateDriverImages() {
        // Logic to update driver images based on map (re-using OpenF1 logic if needed,
        // but syncAllDrivers already handles this)
        // If users need to force update, we can re-run the OpenF1 fetch portion of
        // syncAllDrivers here.
        // For now, let's keep it simple as the screenshot showed drivers HAVE images.
        System.out.println("Driver images are updated via syncAllDrivers.");
    }

    public void cleanupOldRaces() {
        // Delete races from 2025 if they exist, or just clear all and re-import
        System.out.println("Cleaning up races...");
        List<Race> oldRaces = raceRepo.findBySeason("2025");
        if (oldRaces != null && !oldRaces.isEmpty()) {
            raceRepo.deleteAll(oldRaces);
            System.out.println("Deleted " + oldRaces.size() + " races from 2025.");
        }
        // Also trigger accumulation for new season
        accumulateRaces();
    }

    public void exportData() {
        historicalDataLoader.exportDataToJSON();
    }

    public String importHistoricalData() {
        return historicalDataLoader.loadHistoricalData();
    }

    public String cleanupBadDrivers() {
        List<String> badIds = List.of("sergio perez", "valtteri bottas");
        List<Driver> toDelete = new ArrayList<>();
        for (String id : badIds) {
            driverRepo.findById(id).ifPresent(toDelete::add);
        }
        if (!toDelete.isEmpty()) {
            driverRepo.deleteAll(toDelete);
            return "Deleted " + toDelete.size() + " bad driver records.";
        }
        return "No bad driver records found.";
    }

    public void resetDatabase() {
        System.out.println("Resetting database...");
        driverRepo.deleteAll();
        // constructorRepo.deleteAll();
        System.out.println("Database reset complete.");
    }
}
