package com.f1nity.engine.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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
import com.f1nity.library.models.engine.FastestLap;
import com.f1nity.library.repository.engine.ConstructorRepository;
import com.f1nity.library.repository.engine.ConstructorStandingsRepository;
import com.f1nity.library.repository.engine.DriverRepository;
import com.f1nity.library.repository.engine.DriverStandingsRepository;
import com.f1nity.library.repository.engine.RaceRepository;

import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Service
public class FastF1 {

    private final String OPEN_F1 = "https://api.openf1.org/v1/";
    private final String ERGAST_F1 = "https://api.jolpi.ca/ergast/f1/";
    private final Integer MAX_ROUNDS = 24;
    private final WebClient openF1Client;
    private final WebClient ergastClient;

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

    public FastF1(WebClient.Builder builder) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();

        this.openF1Client = builder
                .baseUrl(OPEN_F1)
                .exchangeStrategies(strategies)
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();

        this.ergastClient = builder
                .baseUrl(ERGAST_F1)
                .exchangeStrategies(strategies)
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
    }

    public List<Driver> getAllDrivers() {
        try {
            // Fetch all Ergast drivers with pagination
            Map<String, Driver> mergedDrivers = new HashMap<>();
            int limit = 100;
            int offset = 0;
            int total = 900;

            while (offset < total) {
                String uri = String.format("drivers.json?limit=%d&offset=%d", limit, offset);

                Mono<ErgastResponse> responseMono = ergastClient.get()
                        .uri(uri)
                        .retrieve()
                        .bodyToMono(ErgastResponse.class);

                ErgastResponse ergastResponse = responseMono.block();
                if (ergastResponse == null || ergastResponse.MRData == null || ergastResponse.MRData.DriverTable == null) {
                    break;
                }

                for (ErgastDriver ed : ergastResponse.MRData.DriverTable.Drivers) {
                    String fullName = (ed.getGivenName() + " " + ed.getFamilyName()).toUpperCase();
                    Driver d = new Driver();
                    d.setDriverId(ed.getDriverId() != null ? ed.getDriverId() : fullName.toLowerCase().strip());
                    d.setFirstName(ed.getGivenName());
                    d.setLastName(ed.getFamilyName());
                    d.setFullName(fullName);
                    d.setDateOfBirth(ed.getDateOfBirth());
                    d.setNationality(ed.getNationality());
                    d.setActive(false);
                    d.setDriverNumber(ed.getPermanentNumber());
                    d.setPodiums(0);
                    d.setWins(0);
                    d.setPoints(0);
                    d.setPoles(0);
                    d.setFastestLaps(0);
                    d.setTotalRaces(0);

                    mergedDrivers.put(fullName, d);
                }

                offset += limit;
            }

            // Fetch OpenF1 drivers
            Mono<OpenF1Driver[]> responseMono = openF1Client.get()
                    .uri("drivers")
                    .retrieve()
                    .bodyToMono(OpenF1Driver[].class);

            OpenF1Driver[] openDrivers = responseMono.block();
            Map<String, OpenF1Driver> uniqueDrivers = new HashMap<>();
            if (openDrivers != null) {
                for (OpenF1Driver od : openDrivers) {
                    uniqueDrivers.put(od.getFullName().toUpperCase(), od);
                }
            }

            System.out.println("Merging OpenF1 drivers with Ergast drivers...");
            for (OpenF1Driver od : uniqueDrivers.values()) {
                String key = od.getFullName().toUpperCase();
                if (mergedDrivers.containsKey(key)) {
                    Driver d = mergedDrivers.get(key);
                    d.setActive(true);
                    d.setDriverNumber(od.getDriverNumber());
                    d.setTeamName(od.getTeam_name());
                    d.setDriverImageUrl(od.getHeadshotUrl());
                    d.setPodiums(0);
                    d.setWins(0);
                    d.setPoints(0);
                    d.setPoles(0);
                    d.setFastestLaps(0);
                    d.setTotalRaces(0);
                    mergedDrivers.put(key, d);
                } else {
                    Driver d = new Driver();
                    d.setDriverId(od.getFullName().toLowerCase().strip());
                    d.setFullName(od.getFullName().toUpperCase());
                    d.setActive(true);
                    d.setDriverNumber(od.getDriverNumber());
                    d.setTeamName(od.getTeam_name());
                    d.setDriverImageUrl(od.getHeadshotUrl());
                    d.setWins(0);
                    d.setPodiums(0);
                    d.setPoints(0);
                    d.setPoles(0);
                    d.setFastestLaps(0);
                    d.setTotalRaces(0);
                    mergedDrivers.put(d.getFullName(), d);
                }
            }

            List<Driver> result = new ArrayList<>(mergedDrivers.values());
            driverRepo.saveAll(result);
            return result;

        } catch (WebClientResponseException e) {
            System.err.println("API Error: " + e.getRawStatusCode() + " - " + e.getMessage());
        } catch (Exception e) {
            System.err.println("General Error while fetching drivers: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    public List<Constructor> getAllConstructors() {
        try {
            int limit = 100;
            int offset = 0;
            int total = 250;
            List<Constructor> constructorList = new ArrayList<>();

            while (offset < total) {
                String uri = String.format("constructors.json?limit=%d&offset=%d", limit, offset);
                Mono<ConstructorResponse> response = ergastClient.get()
                        .uri(uri)
                        .retrieve()
                        .bodyToMono(ConstructorResponse.class);

                ConstructorResponse constructors = response.block();
                if (constructors == null || constructors.MRData == null || constructors.MRData.getConstructorTable() == null) {
                    break;
                }

                for (ErgastConstructor constructor : constructors.MRData.getConstructorTable().getConstructors()) {
                    Constructor c = new Constructor();
                    c.setPodiums(0);
                    c.setWins(0);
                    c.setPoints(0);
                    c.setPolePositions(0);
                    c.setFastestLaps(0);
                    c.setTotalRaces(0);
                    c.setConstructorId(constructor.getConstructorId());
                    c.setUrl(constructor.getUrl());
                    c.setNationality(constructor.getNationality());
                    c.setName(constructor.getName());
                    constructorList.add(c);
                }

                offset += limit;
            }

            constructorRepo.saveAll(constructorList);
            return constructorList;

        } catch (Exception e) {
            System.err.println("Error fetching constructors: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    public void updateStatistics() {
        Integer year = 2025;
        Integer round = 1;

        while (year >= 2001) {
            while (round <= MAX_ROUNDS) {
                String raceUri = String.format("%d/%d/results.json", year, round);
                String qualiUri = String.format("%d/%d/qualifying.json", year, round);
                String context = "year " + year + ", round " + round;

                try {
                    RaceResponse raceResponse = fetchWithRetry(
                            () -> ergastClient.get().uri(raceUri).retrieve().bodyToMono(RaceResponse.class),
                            "race results for " + context);

                    if (raceResponse == null || raceResponse.getMrData() == null ||
                        raceResponse.getMrData().getRaceTable() == null ||
                        raceResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                        System.out.println("No race data for " + context);
                        round++;
                        try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                        continue;
                    }

                    Race race = raceResponse.getMrData().getRaceTable().getRaces().get(0);
                    String circuitId = race.getCircuit().getCircuitId();
                    
                    List<Result> results = race.getResults();

                    if (results == null || results.isEmpty()) {
                        System.out.println("No results in race data for " + context);
                        round++;
                        try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                        continue;
                    }

                    RaceResponse qualiResponse = fetchWithRetry(
                            () -> ergastClient.get().uri(qualiUri).retrieve().bodyToMono(RaceResponse.class),
                            "qualifying results for " + context);
                    
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
                    Map<String,Race> updateRaces = new HashMap<>();
                    String currentRound = race.getRound();
                    // Process race results for 2025 only (for standings collections)
                    if (year == 2025) {
                        for (int i = 0; i < results.size(); i++) {
                            Result result = results.get(i);
                            Race existingRace = raceRepo.findByRound(currentRound);
                            if (existingRace != null) {
                                existingRace.setStandingsUpdated(true);
                                updateRaces.put(currentRound, existingRace);
                            } else {
                                System.out.println("Warning: Race not found for round " + currentRound + " in year " + year);
                            }
                            ErgastDriver ergDriver = result.getDriver();
                            ErgastConstructor egConstructor = result.getConstructor();

                            if (ergDriver == null || egConstructor == null) continue;

                            String driverId = ergDriver.getDriverId();
                            String constructorId = egConstructor.getConstructorId();

                            Optional<Driver> driverOpt = driverRepo.findById(driverId);
                            Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);

                            if (driverOpt.isEmpty()) {
                                System.out.println("Missing driver: " + driverId + " for " + context);
                                continue;
                            }
                            if (constructorOpt.isEmpty()) {
                                System.out.println("Missing constructor: " + constructorId + " for " + context);
                                continue;
                            }
                            
                            Driver driver = driverOpt.get();
                            Constructor constructor = updatedConstructors.computeIfAbsent(constructorId, k -> constructorOpt.get());
                            DriverStanding driverStanding = updatedDriverStandings.computeIfAbsent(driverId, k -> {
                                DriverStanding ds = new DriverStanding();
                                ds.setDriverId(driverId);
                                ds.setFullName(driver.getFullName());
                                ds.setTeamName(constructor.getName());
                                ds.setPoints(0);
                                ds.setWins(0);
                                ds.setPodiums(0);
                                ds.setPosition(0);
                                return ds;
                            });
                            ConstructorStanding constructorStanding = updatedConstructorStandings.computeIfAbsent(constructorId, k -> {
                                ConstructorStanding cs = new ConstructorStanding();
                                cs.setConstructorId(constructorId);
                                cs.setName(constructor.getName());
                                cs.setPoints(0);
                                cs.setWins(0);
                                cs.setPodiums(0);
                                cs.setPosition(0);
                                return cs;
                            });
                            
                            updatedDrivers.putIfAbsent(driverId, driver);

                            if (i == 0) { // Winner
                                driver.setWins(driver.getWins() + 1);
                                driver.setPodiums(driver.getPodiums() + 1);
                                constructor.setWins(constructor.getWins() + 1);
                                constructor.setPodiums(constructor.getPodiums() + 1);
                                driverStanding.setWins(driverStanding.getWins() + 1);
                                driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                                constructorStanding.setWins(constructorStanding.getWins() + 1);
                                constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                            } else if (i < 3) { // Podium
                                driver.setPodiums(driver.getPodiums() + 1);
                                constructor.setPodiums(constructor.getPodiums() + 1);
                                driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                                constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                            }

                            if (result.getPoints() != null && !result.getPoints().isEmpty()) {
                                try {
                                    double points = Double.parseDouble(result.getPoints());
                                    driver.setPoints(driver.getPoints() + points);
                                    constructor.setPoints(constructor.getPoints() + points);
                                    driverStanding.setPoints(driverStanding.getPoints() + points);
                                    constructorStanding.setPoints(constructorStanding.getPoints() + points);
                                } catch (NumberFormatException e) {
                                    System.err.println("Could not parse points: " + result.getPoints() + " for driver " + driverId + " in " + context);
                                }
                            }

                            if (result.getFastestLap() != null && result.getFastestLap().getRank() != null &&
                                result.getFastestLap().getRank().equals("1")) {
                                driver.setFastestLaps(driver.getFastestLaps() != null ? driver.getFastestLaps() + 1: 1);
                                constructor.setFastestLaps(constructor.getFastestLaps() != null ? constructor.getFastestLaps() + 1: 1);
                            }
                            
                            driver.setTotalRaces(driver.getTotalRaces() != null ? driver.getTotalRaces() + 1 : 1);
                            if (!constructorsProcessedForTotalRaces.contains(constructorId)) {
                                constructor.setTotalRaces(constructor.getTotalRaces() != null ? constructor.getTotalRaces() + 1 : 1);
                                constructorsProcessedForTotalRaces.add(constructorId);
                            }
                            
                            updatedDrivers.put(driverId, driver);
                            updatedConstructors.put(constructorId, constructor);
                            updatedDriverStandings.put(driverId, driverStanding);
                            updatedConstructorStandings.put(constructorId, constructorStanding);
                        }
                    } else {
                        // Process race results for pre-2025 (only update Driver and Constructor)
                        for (int i = 0; i < results.size(); i++) {
                            Result result = results.get(i);
                            ErgastDriver ergDriver = result.getDriver();
                            ErgastConstructor egConstructor = result.getConstructor();

                            if (ergDriver == null || egConstructor == null) continue;

                            String driverId = ergDriver.getDriverId();
                            String constructorId = egConstructor.getConstructorId();

                            Optional<Driver> driverOpt = driverRepo.findById(driverId);
                            Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);

                            if (driverOpt.isEmpty()) {
                                System.out.println("Missing driver: " + driverId + " for " + context);
                                continue;
                            }
                            if (constructorOpt.isEmpty()) {
                                System.out.println("Missing constructor: " + constructorId + " for " + context);
                                continue;
                            }
                            
                            Driver driver = driverOpt.get();
                            Constructor constructor = updatedConstructors.computeIfAbsent(constructorId, k -> constructorOpt.get());
                            
                            updatedDrivers.putIfAbsent(driverId, driver);

                            if (i == 0) { // Winner
                                driver.setWins(driver.getWins() + 1);
                                driver.setPodiums(driver.getPodiums() + 1);
                                constructor.setWins(constructor.getWins() + 1);
                                constructor.setPodiums(constructor.getPodiums() + 1);
                            } else if (i < 3) { // Podium
                                driver.setPodiums(driver.getPodiums() + 1);
                                constructor.setPodiums(constructor.getPodiums() + 1);
                            }

                            if (result.getPoints() != null && !result.getPoints().isEmpty()) {
                                try {
                                    int points = Integer.parseInt(result.getPoints());
                                    driver.setPoints(driver.getPoints() + points);
                                    constructor.setPoints(constructor.getPoints() + points);
                                } catch (NumberFormatException e) {
                                    System.err.println("Could not parse points: " + result.getPoints() + " for driver " + driverId + " in " + context);
                                }
                            }

                            if (result.getFastestLap() != null && result.getFastestLap().getRank() != null &&
                                result.getFastestLap().getRank().equals("1")) {
                                driver.setFastestLaps(driver.getFastestLaps() + 1);
                                constructor.setFastestLaps(constructor.getFastestLaps() + 1);
                            }
                            
                            driver.setTotalRaces(driver.getTotalRaces() != null ? driver.getTotalRaces() + 1 : 1);
                            if (!constructorsProcessedForTotalRaces.contains(constructorId)) {
                                constructor.setTotalRaces(constructor.getTotalRaces() != null ? constructor.getTotalRaces() + 1 : 1);
                                constructorsProcessedForTotalRaces.add(constructorId);
                            }
                            
                            updatedDrivers.put(driverId, driver);
                            updatedConstructors.put(constructorId, constructor);
                        }
                    }

                    // Process qualifying results (poles)
                    if (qualiResults != null && !qualiResults.isEmpty()) {
                        Result poleResult = qualiResults.get(0); // Assuming first result is P1
                        if (poleResult.getPosition() != null && poleResult.getPosition().equals("1")) {
                            ErgastDriver ergDriver = poleResult.getDriver();
                            ErgastConstructor egConstructor = poleResult.getConstructor();

                            if (ergDriver != null && egConstructor != null) {
                                String driverId = ergDriver.getDriverId();
                                String constructorId = egConstructor.getConstructorId();

                                Driver driver = updatedDrivers.get(driverId);
                                Constructor constructor = updatedConstructors.get(constructorId);
                                
                                // If driver/constructor not in map yet (e.g. only pole, no race result), fetch them
                                if (driver == null) {
                                    Optional<Driver> dOpt = driverRepo.findById(driverId);
                                    if (dOpt.isPresent()) driver = dOpt.get();
                                }
                                if (constructor == null) {
                                     Optional<Constructor> cOpt = constructorRepo.findById(constructorId);
                                     if (cOpt.isPresent()) constructor = cOpt.get();
                                }

                                if (driver != null && constructor != null) {
                                    driver.setPoles(driver.getPoles() + 1);
                                    constructor.setPolePositions(constructor.getPolePositions() + 1);
                                    updatedDrivers.put(driverId, driver); // Ensure they are in map for saving
                                    updatedConstructors.put(constructorId, constructor);
                                } else {
                                     System.out.println("Pole driver/constructor not found or not in updated map: " + driverId + "/" + constructorId + " for " + context);
                                }
                            }
                        }
                    }
                    
                    if (!updatedDrivers.isEmpty()) {
                        driverRepo.saveAll(updatedDrivers.values());
                    }
                    if (!updatedConstructors.isEmpty()) {
                        constructorRepo.saveAll(updatedConstructors.values());
                    }
                    if (year == 2025) {
                        if (!updatedDriverStandings.isEmpty()) {
                            driverStandingsRepo.saveAll(updatedDriverStandings.values());
                        }
                        if (!updatedConstructorStandings.isEmpty()) {
                            constructorStandingsRepo.saveAll(updatedConstructorStandings.values());
                        }
                    }
                    if(!updateRaces.isEmpty()){
                        raceRepo.saveAll(updateRaces.values());
                    }

                    System.out.println("Successfully processed " + context + ", circuit " + circuitId);

                } catch (WebClientResponseException e) {
                    System.err.println("WebClientResponseException for " + context + " after retries (or non-retryable): " + e.getRawStatusCode() + " - " + e.getMessage());
                } catch (Exception e) {
                    System.err.println("General error processing " + context + ": " + e.getMessage());
                    e.printStackTrace();
                }

                round++;
                try {
                    Thread.sleep(1000); // 1-second delay between rounds
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Interrupted during round delay for " + context);
                }
            }

            year--;
            round = 1;
            if (year >= 2001) { // Only sleep if there are more years to process
                try {
                    System.out.println("Waiting for 60 seconds before processing year " + year + "...");
                    Thread.sleep(60000); // 1-minute delay between years
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Interrupted during year delay before year " + year);
                }
            }
        }
        // System.out.println("Circuit Statistics (not implemented): " + circuitStats);
    }

    private <T> T fetchWithRetry(Supplier<Mono<T>> monoSupplier, String contextForLogging) {
        int retryCount = 0;
        int maxRetries = 5;
        long waitTimeMillis = 60000; // Start with 60 seconds for Ergast

        while (retryCount <= maxRetries) {
            try {
                return monoSupplier.get().block(); // Blocking call
            } catch (WebClientResponseException e) {
                if (e.getRawStatusCode() == 429 && retryCount < maxRetries) {
                    retryCount++;
                    System.out.println("Rate limit (429) for " + contextForLogging +
                            ". Retry " + retryCount + "/" + maxRetries +
                            ". Waiting for " + (waitTimeMillis / 1000) + " seconds...");
                    try {
                        Thread.sleep(waitTimeMillis);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        System.err.println("Retry sleep interrupted for " + contextForLogging);
                        throw e;
                    }
                    waitTimeMillis *= 2; // Exponential backoff
                } else if (e.getRawStatusCode() == 404 || e.getRawStatusCode() == 503) { // 404: Not Found (e.g. race doesn't exist), 503: Service Unavailable
                     System.out.println("API returned " + e.getRawStatusCode() + " for " + contextForLogging + ". Assuming no data. Message: " + e.getMessage());
                     return null; // Treat as no data available
                }
                else {
                    System.err.println("Non-retryable WebClientResponseException for " + contextForLogging + ": " + e.getRawStatusCode() + " - " + e.getMessage());
                    throw e;
                }
            } catch (Exception e) {
                 // Includes situations like connection errors, timeout before response, etc.
                if (retryCount < maxRetries) {
                    retryCount++;
                    System.out.println("General error for " + contextForLogging +
                            ". Retry " + retryCount + "/" + maxRetries +
                            ". Waiting for " + (waitTimeMillis / 1000) + " seconds... Error: " + e.getMessage());
                    try {
                        Thread.sleep(waitTimeMillis);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        System.err.println("Retry sleep interrupted for " + contextForLogging);
                        throw e; // Re-throw if interrupted
                    }
                    waitTimeMillis *= 1.5; // Less aggressive backoff for general errors
                } else {
                    System.err.println("General error after max retries for " + contextForLogging + ": " + e.getMessage());
                    throw e; // Re-throw after max retries
                }
            }
        }
        System.err.println("Max retries reached for " + contextForLogging + ". Returning null.");
        return null;
    }

    public Map<String,String> getCurrentDriversId(){
        String uri = "drivers?meeting_key=latest&session_key=latest";
        Mono<OpenF1Driver[]> response = openF1Client.get().uri(uri).retrieve().bodyToMono(OpenF1Driver[].class);
        OpenF1Driver[] currDrivers = response.block();
        Map<String,String> driverMapping = new HashMap<>();
        for(OpenF1Driver od : currDrivers){
            driverMapping.put(od.getDriverNumber(),od.getFullName().toUpperCase());
        }
        return driverMapping;
    }

    public String getSprintStatistics() {
        Integer year = 2025;
        Integer round = 1;

        while (year >= 2021) { // Sprints exist from 2021 onwards
            while (round <= MAX_ROUNDS) {
                String sprintUri = String.format("%d/%d/sprint.json", year, round);
                String context = "sprint for year " + year + ", round " + round;

                Map<String, Driver> updatedDrivers = new HashMap<>();
                Map<String, Constructor> updatedConstructors = new HashMap<>();
                Map<String, DriverStanding> updatedDriverStandings = new HashMap<>();
                Map<String, ConstructorStanding> updatedConstructorStandings = new HashMap<>();
                Set<String> constructorsProcessedForSprintRaceCount = new HashSet<>();

                try {
                    RaceResponse sprintResponse = fetchWithRetry(
                            () -> ergastClient.get().uri(sprintUri).retrieve().bodyToMono(RaceResponse.class),
                            context);

                    if (sprintResponse == null || sprintResponse.getMrData() == null ||
                        sprintResponse.getMrData().getRaceTable() == null ||
                        sprintResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                        System.out.println("No sprint data found for " + context);
                        round++;
                        try { Thread.sleep(5000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } // Shorter delay for rounds
                        continue;
                    }

                    Race sprintRace = sprintResponse.getMrData().getRaceTable().getRaces().get(0);
                    List<Result> sprintResults = sprintRace.getSprintResults();

                    if (sprintResults == null || sprintResults.isEmpty()) {
                        System.out.println("No results in sprint data for " + context);
                        round++;
                        try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                        continue;
                    }

                    if (year == 2025) {
                        for (Result sprintObj : sprintResults) {
                            if (sprintObj.getDriver() == null || sprintObj.getConstructor() == null) {
                                System.out.println("Sprint result missing driver or constructor for " + context);
                                continue;
                            }

                            String driverId = sprintObj.getDriver().getDriverId();
                            String constructorId = sprintObj.getConstructor().getConstructorId();

                            Optional<Driver> driverOpt = driverRepo.findById(driverId);
                            Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);
                            Optional<DriverStanding> driverStandingOpt = driverStandingsRepo.findById(driverId);
                            Optional<ConstructorStanding> constructorStandingOpt = constructorStandingsRepo.findById(constructorId);

                            if (driverOpt.isEmpty()) {
                                System.out.println("Driver not found in DB: " + driverId + " for " + context);
                                continue;
                            }
                            if (constructorOpt.isEmpty()) {
                                System.out.println("Constructor not found in DB: " + constructorId + " for " + context);
                                continue;
                            }

                            final Driver currentDriver = driverOpt.get();
                            final Constructor currentConstructor = constructorOpt.get();
                            final DriverStanding driverStanding = driverStandingOpt.orElseGet(() -> {
                                DriverStanding ds = new DriverStanding();
                                ds.setDriverId(driverId);
                                ds.setFullName(currentDriver.getFullName());
                                ds.setTeamName(currentConstructor.getName());
                                ds.setPoints(0);
                                ds.setWins(0);
                                ds.setPodiums(0);
                                ds.setPosition(0);
                                return ds;
                            });
                            final ConstructorStanding constructorStanding = constructorStandingOpt.orElseGet(() -> {
                                ConstructorStanding cs = new ConstructorStanding();
                                cs.setConstructorId(constructorId);
                                cs.setName(currentConstructor.getName());
                                cs.setPoints(0);
                                cs.setWins(0);
                                cs.setPodiums(0);
                                cs.setPosition(0);
                                return cs;
                            });

                            // Use maps to ensure we are updating the same instance
                            final Driver driver = updatedDrivers.computeIfAbsent(driverId, k -> currentDriver);
                            final Constructor constructor = updatedConstructors.computeIfAbsent(constructorId, k -> currentConstructor);
                            updatedDriverStandings.putIfAbsent(driverId, driverStanding);
                            updatedConstructorStandings.putIfAbsent(constructorId, constructorStanding);

                            // Update points
                            if (sprintObj.getPoints() != null && !sprintObj.getPoints().isEmpty()) {
                                try {
                                    int points = Integer.parseInt(sprintObj.getPoints());
                                    driver.setPoints(driver.getPoints() + points);
                                    constructor.setPoints(constructor.getPoints() + points);
                                    driverStanding.setPoints(driverStanding.getPoints() + points);
                                    constructorStanding.setPoints(constructorStanding.getPoints() + points);
                                } catch (NumberFormatException e) {
                                    System.err.println("Could not parse sprint points: " + sprintObj.getPoints() + " for " + context);
                                }
                            }

                            // Update sprint-specific stats
                            String position = sprintObj.getPosition();
                            if (position != null) {
                                if (position.equals("1")) {
                                    driver.setSprintWins(driver.getSprintWins() != null ? driver.getSprintWins() + 1 : 1);
                                    driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
                                    constructor.setSprintWins(constructor.getSprintWins() != null ? constructor.getSprintWins() + 1 : 1);
                                    constructor.setSprintPodiums(constructor.getSprintPodiums() != null ? constructor.getSprintPodiums() + 1 : 1);
                                    driverStanding.setWins(driverStanding.getWins() + 1);
                                    driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                                    constructorStanding.setWins(constructorStanding.getWins() + 1);
                                    constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                                } else if (position.equals("2") || position.equals("3")) {
                                    driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
                                    constructor.setSprintPodiums(constructor.getSprintPodiums() != null ? constructor.getSprintPodiums() + 1 : 1);
                                    driverStanding.setPodiums(driverStanding.getPodiums() + 1);
                                    constructorStanding.setPodiums(constructorStanding.getPodiums() + 1);
                                }
                            }
                            driver.setSprintRaces(driver.getSprintRaces() != null ? driver.getSprintRaces() + 1 : 1);
                            if (!constructorsProcessedForSprintRaceCount.contains(constructorId)) {
                                constructor.setSprintRaces(constructor.getSprintRaces() != null ? constructor.getSprintRaces() + 1 : 1);
                                constructorsProcessedForSprintRaceCount.add(constructorId);
                            }
                        }
                    } else {
                        // Process pre-2025 sprint results (only update Driver and Constructor)
                        for (Result sprintObj : sprintResults) {
                            if (sprintObj.getDriver() == null || sprintObj.getConstructor() == null) {
                                System.out.println("Sprint result missing driver or constructor for " + context);
                                continue;
                            }

                            String driverId = sprintObj.getDriver().getDriverId();
                            String constructorId = sprintObj.getConstructor().getConstructorId();

                            Optional<Driver> driverOpt = driverRepo.findById(driverId);
                            Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);

                            if (driverOpt.isEmpty()) {
                                System.out.println("Driver not found in DB: " + driverId + " for " + context);
                                continue;
                            }
                            if (constructorOpt.isEmpty()) {
                                System.out.println("Constructor not found in DB: " + constructorId + " for " + context);
                                continue;
                            }

                            final Driver currentDriver = driverOpt.get();
                            final Constructor currentConstructor = constructorOpt.get();
                            
                            final Driver driver = updatedDrivers.computeIfAbsent(driverId, k -> currentDriver);
                            final Constructor constructor = updatedConstructors.computeIfAbsent(constructorId, k -> currentConstructor);

                            if (sprintObj.getPoints() != null && !sprintObj.getPoints().isEmpty()) {
                                try {
                                    int points = Integer.parseInt(sprintObj.getPoints());
                                    driver.setPoints(driver.getPoints() + points);
                                    constructor.setPoints(constructor.getPoints() + points);
                                } catch (NumberFormatException e) {
                                    System.err.println("Could not parse sprint points: " + sprintObj.getPoints() + " for " + context);
                                }
                            }

                            String position = sprintObj.getPosition();
                            if (position != null) {
                                if (position.equals("1")) {
                                    driver.setSprintWins(driver.getSprintWins() != null ? driver.getSprintWins() + 1 : 1);
                                    driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
                                    constructor.setSprintWins(constructor.getSprintWins() != null ? constructor.getSprintWins() + 1 : 1);
                                    constructor.setSprintPodiums(constructor.getSprintPodiums() != null ? constructor.getSprintPodiums() + 1 : 1);
                                } else if (position.equals("2") || position.equals("3")) {
                                    driver.setSprintPodiums(driver.getSprintPodiums() != null ? driver.getSprintPodiums() + 1 : 1);
                                    constructor.setSprintPodiums(constructor.getSprintPodiums() != null ? constructor.getSprintPodiums() + 1 : 1);
                                }
                            }
                            driver.setSprintRaces(driver.getSprintRaces() != null ? driver.getSprintRaces() + 1 : 1);
                            if (!constructorsProcessedForSprintRaceCount.contains(constructorId)) {
                                constructor.setSprintRaces(constructor.getSprintRaces() != null ? constructor.getSprintRaces() + 1 : 1);
                                constructorsProcessedForSprintRaceCount.add(constructorId);
                            }
                        }
                    }

                    if (!updatedDrivers.isEmpty()) {
                        driverRepo.saveAll(updatedDrivers.values());
                    }
                    if (!updatedConstructors.isEmpty()) {
                        constructorRepo.saveAll(updatedConstructors.values());
                    }
                    if (year == 2025) {
                        if (!updatedDriverStandings.isEmpty()) {
                            driverStandingsRepo.saveAll(updatedDriverStandings.values());
                        }
                        if (!updatedConstructorStandings.isEmpty()) {
                            constructorStandingsRepo.saveAll(updatedConstructorStandings.values());
                        }
                    }
                    System.out.println("Successfully processed " + context);

                } catch (WebClientResponseException e) {
                    System.err.println("WebClientResponseException for " + context + " after retries: " + e.getRawStatusCode() + " - " + e.getMessage());
                } catch (Exception e) {
                    System.err.println("General error processing " + context + ": " + e.getMessage());
                    e.printStackTrace();
                }

                round++;
                try {
                    Thread.sleep(1000); // 1-second delay between sprint rounds
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Interrupted during sprint round delay for " + context);
                }
            }

            year--;
            round = 1; // Reset round for the next year
            if (year >= 2021) { // Only sleep if there are more years to process
                try {
                    System.out.println("Waiting for 30 seconds before processing sprints for year " + year + "...");
                    Thread.sleep(30000); // 30-second delay between years for sprints
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Interrupted during sprint year delay before year " + year);
                }
            }
        }
        System.out.println("Sprint statistics update complete.");
        return "OK";
    }

    public String updateStandings() {
        // Update driver standings
        String driverContext = "driver standings for 2025";
        String driverUri = "2025/driverstandings.json";

        try {
            ErgastDriverStandingsResponse driverResponse = fetchWithRetry(
                    () -> ergastClient.get().uri(driverUri).retrieve().bodyToMono(ErgastDriverStandingsResponse.class),
                    driverContext);

            if (driverResponse == null || driverResponse.MRData == null ||
                driverResponse.MRData.StandingsTable == null ||
                driverResponse.MRData.StandingsTable.StandingsLists.isEmpty()) {
                System.out.println("No driver standings data for " + driverContext);
                return "No driver standings data available";
            }

            List<ErgastDriverStandingsResponse.DriverStanding> driverStandings = 
                driverResponse.MRData.StandingsTable.StandingsLists.get(0).DriverStandings;
            
            List<DriverStanding> updatedDriverStandings = new ArrayList<>();

            for (ErgastDriverStandingsResponse.DriverStanding standing : driverStandings) {
                String driverId = standing.Driver.getDriverId();
                Optional<Driver> driverOpt = driverRepo.findById(driverId);

                if (driverOpt.isEmpty()) {
                    System.out.println("Driver not found in DB: " + driverId + " for " + driverContext);
                    continue;   
                }
                Optional<DriverStanding> existingDriverStandingOpt = driverStandingsRepo.findById(driverId);
                DriverStanding existingDriverStanding = existingDriverStandingOpt.get();
                Driver driver = driverOpt.get();
                DriverStanding driverStanding = new DriverStanding();
                driverStanding.setDriverId(driverId);
                driverStanding.setFullName(driver.getFullName());
                driverStanding.setTeamName(!standing.Constructors.isEmpty() ? standing.Constructors.get(0).getName() : "");
                
                // Calculate position change from previous race
                Integer currentPosition = Integer.parseInt(standing.position);
                Integer currentWins = Integer.parseInt(standing.wins);
                double currentPoints = Double.parseDouble(standing.points);
                
                // Get previous race position and calculate position change
                Optional<DriverStanding> prevStanding = driverStandingsRepo.findById(driverId);
                int positionsMoved = 0; // Default to 0 if no previous race data
                if (prevStanding.isPresent()) {
                    DriverStanding prev = prevStanding.get();
                    // Calculate position change: positive if moved up, negative if moved down
                    positionsMoved = currentPosition - prev.getPosition();
                }
                
                try {
                    driverStanding.setPosition(currentPosition);
                    driverStanding.setPoints(currentPoints);
                    driverStanding.setWins(currentWins);
                    driverStanding.setPositionsMoved(positionsMoved);
                    // Podiums not directly available in standings API; calculate via results in updateStatistics
                    driverStanding.setPodiums(0);
                } catch (NumberFormatException e) {
                    System.err.println("Could not parse driver standing data for " + driverId + ": " + e.getMessage());
                    continue;
                } finally {
                    updatedDriverStandings.add(driverStanding);
                }
                updatedDriverStandings.add(driverStanding);
            }

            if (!updatedDriverStandings.isEmpty()) {
                driverStandingsRepo.deleteAll();
                driverStandingsRepo.saveAll(updatedDriverStandings);
                System.out.println("Updated " + updatedDriverStandings.size() + " driver standings for 2025");
            }

            // Update constructor standings
            String constructorContext = "constructor standings for 2025";
            String constructorUri = "2025/constructorstandings.json";

            ErgastConstructorStandingsResponse constructorResponse = fetchWithRetry(
                    () -> ergastClient.get().uri(constructorUri).retrieve().bodyToMono(ErgastConstructorStandingsResponse.class),
                    constructorContext);

            if (constructorResponse == null || constructorResponse.MRData == null ||
                constructorResponse.MRData.StandingsTable == null ||
                constructorResponse.MRData.StandingsTable.StandingsLists.isEmpty()) {
                System.out.println("No constructor standings data for " + constructorContext);
                return "No constructor standings data available";
            }

            List<ErgastConstructorStandingsResponse.ConstructorStanding> constructorStandings = 
                constructorResponse.MRData.StandingsTable.StandingsLists.get(0).ConstructorStandings;
            
            List<ConstructorStanding> updatedConstructorStandings = new ArrayList<>();

            for (ErgastConstructorStandingsResponse.ConstructorStanding standing : constructorStandings) {
                String constructorId = standing.Constructor.getConstructorId();
                Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);

                if (constructorOpt.isEmpty()) {
                    System.out.println("Constructor not found in DB: " + constructorId + " for " + constructorContext);
                    continue;
                }

                Constructor constructor = constructorOpt.get();
                ConstructorStanding constructorStanding = new ConstructorStanding();
                Optional<ConstructorStanding> existingConstructorStandingOpt = constructorStandingsRepo.findById(constructorId);
                ConstructorStanding existingConstructorStanding = existingConstructorStandingOpt.get();
                constructorStanding.setConstructorId(constructorId);
                constructorStanding.setName(constructor.getName());
                constructorStanding.setColor(constructor.getColorCode());
                
                // Calculate previous race points
                double currentPoints = Double.parseDouble(standing.points);
                Integer currentWins = Integer.parseInt(standing.wins);
                Integer currentPosition = Integer.parseInt(standing.position);
                
                // Get previous race points by subtracting current race points
                Optional<ConstructorStanding> prevStanding = constructorStandingsRepo.findById(constructorId);
                Integer positionsMoved = 0;
                if (prevStanding != null && prevStanding.isPresent()) {
                    ConstructorStanding prev = prevStanding.get();
                    positionsMoved =  currentPosition - prev.getPosition();
                }
                
                try {
                    constructorStanding.setPosition(currentPosition);
                    constructorStanding.setPoints(currentPoints);
                    constructorStanding.setWins(currentWins);
                    constructorStanding.setpositionsMoved(positionsMoved);
                    // Podiums not directly available; calculate via results in updateStatistics
                    constructorStanding.setPodiums(0);
                } catch (NumberFormatException e) {
                    System.err.println("Could not parse constructor standing data for " + constructorId + ": " + e.getMessage());
                    continue;
                } finally {
                    updatedConstructorStandings.add(constructorStanding);
                }
                updatedConstructorStandings.add(constructorStanding);
            }

            if (!updatedConstructorStandings.isEmpty()) {
                constructorStandingsRepo.deleteAll();
                constructorStandingsRepo.saveAll(updatedConstructorStandings);
                System.out.println("Updated " + updatedConstructorStandings.size() + " constructor standings for 2025");
            }

            return "Successfully updated driver and constructor standings";

        } catch (WebClientResponseException e) {
            System.err.println("WebClientResponseException for standings: " + e.getRawStatusCode() + " - " + e.getMessage());
            return "API error: " + e.getMessage();
        } catch (Exception e) {
            System.err.println("General error processing standings: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public List<DriverStanding> getDriverStandings() {
        try {
            return driverStandingsRepo.findAll(Sort.by(Sort.Order.asc("position")));
        } catch (Exception e) {
            System.err.println("Error retrieving driver standings: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<ConstructorStanding> getConstructorStandings() {
        try {
            return constructorStandingsRepo.findAll(Sort.by(Sort.Order.asc("position")));
        } catch (Exception e) {
            System.err.println("Error retrieving constructor standings: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Race> accumulateRaces(){
        Integer year = 2025;
        String uri = String.format("%d/races.json",year);
        Mono<RaceResponse> response = ergastClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class);
        RaceResponse allraces = response.block();
        List<Race> races = allraces.getMrData().getRaceTable().getRaces();
        raceRepo.saveAll(races);
        return races;
    }
    
    /**
     * Fetches the latest race results from the Ergast API and stores them in the database.
     * This method should be called periodically (e.g., via a scheduled task) to keep the data up-to-date.
     * 
     * Note: This method will update an existing race entry if it exists in the database but doesn't have results.
     * 
     * @return The latest race with results
     */
    public List<Result> fetchAndStoreLatestRaceResults() {
        try {
            Integer year = 2025;
            // First, get all races for the current year
            String uri = String.format("%d/races.json", year);
            Mono<RaceResponse> response = ergastClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class);
            RaceResponse allRaces = response.block();
            
            if (allRaces == null || allRaces.getMrData() == null || 
                allRaces.getMrData().getRaceTable() == null || 
                allRaces.getMrData().getRaceTable().getRaces().isEmpty()) {
                System.out.println("No races found for the current year.");
                return null;
            }
            
            List<Race> races = allRaces.getMrData().getRaceTable().getRaces();
            
            // Find the latest completed race by checking each race's results
            String latestRound = null;
            
            // Current date in format YYYY-MM-DD
            String currentDate = java.time.LocalDate.now().toString();
            
            // Find the most recent race that has already occurred
            for (Race race : races) {
                if (race.getDate() != null && race.getDate().compareTo(currentDate) <= 0) {
                    latestRound = race.getRound();
                } else {
                    // We've found the first future race, so break
                    break;
                }
            }
            
            if (latestRound == null) {
                System.out.println("No completed races found for the current year.");
                return null;
            }
            
            System.out.println("Latest completed race round: " + latestRound);
            String context = "year " + year + ", round " + latestRound;
            
            // Fetch results for the latest round
            String raceUri = String.format("%d/%s/results.json", year, latestRound);
            String qualiUri = String.format("%d/%s/qualifying.json", year, latestRound);
            String sprintUri = String.format("%d/%s/sprint.json", year, latestRound);
            
            // Fetch race results
            RaceResponse raceResponse = fetchWithRetry(
                    () -> ergastClient.get().uri(raceUri).retrieve().bodyToMono(RaceResponse.class),
                    "race results for " + context);
            
            if (raceResponse == null || raceResponse.getMrData() == null ||
                raceResponse.getMrData().getRaceTable() == null ||
                raceResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                System.out.println("No race results found for " + context);
                return null;
            }
            
            Race latestRace = raceResponse.getMrData().getRaceTable().getRaces().get(0);
            List<Result> results = latestRace.getResults();
            
            if (results == null || results.isEmpty()) {
                System.out.println("No results in race data for " + context);
                return null;
            }
            
            // Fetch qualifying results
            RaceResponse qualiResponse = fetchWithRetry(
                    () -> ergastClient.get().uri(qualiUri).retrieve().bodyToMono(RaceResponse.class),
                    "qualifying results for " + context);
            
            List<Result> qualiResults = Collections.emptyList();
            if (qualiResponse != null && qualiResponse.getMrData() != null &&
                qualiResponse.getMrData().getRaceTable() != null &&
                !qualiResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                Race qualiRace = qualiResponse.getMrData().getRaceTable().getRaces().get(0);
                if (qualiRace.getQualifyingResults() != null) {
                    qualiResults = qualiRace.getQualifyingResults();
                    latestRace.setQualifyingResults(qualiResults);
                }
            }
            
            // Fetch sprint results
            RaceResponse sprintResponse = fetchWithRetry(
                    () -> ergastClient.get().uri(sprintUri).retrieve().bodyToMono(RaceResponse.class),
                    "sprint results for " + context);
            
            List<Result> sprintResults = Collections.emptyList();
            if (sprintResponse != null && sprintResponse.getMrData() != null &&
                sprintResponse.getMrData().getRaceTable() != null &&
                !sprintResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
                Race sprintRace = sprintResponse.getMrData().getRaceTable().getRaces().get(0);
                if (sprintRace.getSprintResults() != null) {
                    sprintResults = sprintRace.getSprintResults();
                    latestRace.setSprintResults(sprintResults);
                }
            }
            
            // First, check if we have an existing race entry for this season and round
            Race existingRace = null;
            List<Race> existingRaces = raceRepo.findAll();
            for (Race race : existingRaces) {
                if (race.getSeason() != null && race.getSeason().equals(year.toString()) &&
                    race.getRound() != null && race.getRound().equals(latestRound)) {
                    existingRace = race;
                    break;
                }
            }
            
            // If we found an existing race, preserve any data that might not be in the new race object
            if (existingRace != null) {
                System.out.println("Found existing race entry for season " + year + ", round " + latestRound);
                
                // Preserve practice session data
                latestRace.setFirstPractice(existingRace.getFirstPractice());
                latestRace.setSecondPractice(existingRace.getSecondPractice());
                latestRace.setThirdPractice(existingRace.getThirdPractice());
                latestRace.setSprintQualifying(existingRace.getSprintQualifying());
                
                // If we didn't get qualifying or sprint results in this fetch, preserve existing ones
                if (latestRace.getQualifyingResults() == null || latestRace.getQualifyingResults().isEmpty()) {
                    latestRace.setQualifyingResults(existingRace.getQualifyingResults());
                    latestRace.setQualifying(existingRace.getQualifying());
                }
                
                if (latestRace.getSprintResults() == null || latestRace.getSprintResults().isEmpty()) {
                    latestRace.setSprintResults(existingRace.getSprintResults());
                    latestRace.setSprint(existingRace.getSprint());
                }
                
                // Delete the existing race to avoid duplicates
                raceRepo.delete(existingRace);
            }
            
            // Mark the race as having standings updated
            latestRace.setStandingsUpdated(true);
            
            // Save the updated race to the database
            System.out.println("Saving race entry with results for season " + year + ", round " + latestRound);
            raceRepo.save(latestRace);
            
            // Process race results to update driver and constructor statistics
            Map<String, Driver> updatedDrivers = new HashMap<>();
            Map<String, Constructor> updatedConstructors = new HashMap<>();
            Set<String> constructorsProcessedForTotalRaces = new HashSet<>();
            
            for (int i = 0; i < results.size(); i++) {
                Result result = results.get(i);
                ErgastDriver ergDriver = result.getDriver();
                ErgastConstructor egConstructor = result.getConstructor();
                
                if (ergDriver == null || egConstructor == null) continue;
                
                String driverId = ergDriver.getDriverId();
                String constructorId = egConstructor.getConstructorId();
                
                Optional<Driver> driverOpt = driverRepo.findById(driverId);
                Optional<Constructor> constructorOpt = constructorRepo.findById(constructorId);
                
                if (driverOpt.isEmpty()) {
                    System.out.println("Missing driver: " + driverId + " for " + context);
                    continue;
                }
                if (constructorOpt.isEmpty()) {
                    System.out.println("Missing constructor: " + constructorId + " for " + context);
                    continue;
                }
                
                Driver driver = updatedDrivers.computeIfAbsent(driverId, k -> driverOpt.get());
                Constructor constructor = updatedConstructors.computeIfAbsent(constructorId, k -> constructorOpt.get());
                
                if (i == 0) { // Winner
                    driver.setWins(driver.getWins() + 1);
                    driver.setPodiums(driver.getPodiums() + 1);
                    constructor.setWins(constructor.getWins() + 1);
                    constructor.setPodiums(constructor.getPodiums() + 1);
                } else if (i < 3) { // Podium
                    driver.setPodiums(driver.getPodiums() + 1);
                    constructor.setPodiums(constructor.getPodiums() + 1);
                }
                
                if (result.getPoints() != null && !result.getPoints().isEmpty()) {
                    try {
                        double points = Double.parseDouble(result.getPoints());
                        driver.setPoints(driver.getPoints() + points);
                        constructor.setPoints(constructor.getPoints() + points);
                    } catch (NumberFormatException e) {
                        System.err.println("Could not parse points: " + result.getPoints() + " for driver " + driverId + " in " + context);
                    }
                }
                
                if (result.getFastestLap() != null && result.getFastestLap().getRank() != null &&
                    result.getFastestLap().getRank().equals("1")) {
                    driver.setFastestLaps(driver.getFastestLaps() != null ? driver.getFastestLaps() + 1 : 1);
                    constructor.setFastestLaps(constructor.getFastestLaps() != null ? constructor.getFastestLaps() + 1 : 1);
                }
                
                driver.setTotalRaces(driver.getTotalRaces() != null ? driver.getTotalRaces() + 1 : 1);
                if (!constructorsProcessedForTotalRaces.contains(constructorId)) {
                    constructor.setTotalRaces(constructor.getTotalRaces() != null ? constructor.getTotalRaces() + 1 : 1);
                    constructorsProcessedForTotalRaces.add(constructorId);
                }
            }
            
            // Process qualifying results (poles)
            if (qualiResults != null && !qualiResults.isEmpty()) {
                Result poleResult = qualiResults.get(0); // Assuming first result is P1
                if (poleResult.getPosition() != null && poleResult.getPosition().equals("1")) {
                    ErgastDriver ergDriver = poleResult.getDriver();
                    ErgastConstructor egConstructor = poleResult.getConstructor();
                    
                    if (ergDriver != null && egConstructor != null) {
                        String driverId = ergDriver.getDriverId();
                        String constructorId = egConstructor.getConstructorId();
                        
                        Driver driver = updatedDrivers.get(driverId);
                        Constructor constructor = updatedConstructors.get(constructorId);
                        
                        // If driver/constructor not in map yet (e.g. only pole, no race result), fetch them
                        if (driver == null) {
                            Optional<Driver> dOpt = driverRepo.findById(driverId);
                            if (dOpt.isPresent()) driver = dOpt.get();
                        }
                        if (constructor == null) {
                            Optional<Constructor> cOpt = constructorRepo.findById(constructorId);
                            if (cOpt.isPresent()) constructor = cOpt.get();
                        }
                        
                        if (driver != null && constructor != null) {
                            driver.setPoles(driver.getPoles() + 1);
                            constructor.setPolePositions(constructor.getPolePositions() + 1);
                            updatedDrivers.put(driverId, driver); // Ensure they are in map for saving
                            updatedConstructors.put(constructorId, constructor);
                        } else {
                            System.out.println("Pole driver/constructor not found or not in updated map: " + driverId + "/" + constructorId + " for " + context);
                        }
                    }
                }
            }
            
            // Process sprint results if available
            if (sprintResults != null && !sprintResults.isEmpty()) {
                for (int i = 0; i < sprintResults.size(); i++) {
                    Result result = sprintResults.get(i);
                    ErgastDriver ergDriver = result.getDriver();
                    ErgastConstructor egConstructor = result.getConstructor();
                    
                    if (ergDriver == null || egConstructor == null) continue;
                    
                    String driverId = ergDriver.getDriverId();
                    String constructorId = egConstructor.getConstructorId();
                    
                    Driver driver = updatedDrivers.get(driverId);
                    Constructor constructor = updatedConstructors.get(constructorId);
                    
                    // If driver/constructor not in map yet, fetch them
                    if (driver == null) {
                        Optional<Driver> dOpt = driverRepo.findById(driverId);
                        if (dOpt.isPresent()) driver = dOpt.get();
                        else continue;
                    }
                    if (constructor == null) {
                        Optional<Constructor> cOpt = constructorRepo.findById(constructorId);
                        if (cOpt.isPresent()) constructor = cOpt.get();
                        else continue;
                    }
                    
                    // Add sprint points
                    if (result.getPoints() != null && !result.getPoints().isEmpty()) {
                        try {
                            double points = Double.parseDouble(result.getPoints());
                            driver.setPoints(driver.getPoints() + points);
                            constructor.setPoints(constructor.getPoints() + points);
                            updatedDrivers.put(driverId, driver);
                            updatedConstructors.put(constructorId, constructor);
                        } catch (NumberFormatException e) {
                            System.err.println("Could not parse sprint points: " + result.getPoints() + " for driver " + driverId + " in " + context);
                        }
                    }
                }
            }
            
            // Save all updated drivers and constructors
            if (!updatedDrivers.isEmpty()) {
                driverRepo.saveAll(updatedDrivers.values());
                System.out.println("Updated " + updatedDrivers.size() + " drivers for " + context);
            }
            if (!updatedConstructors.isEmpty()) {
                constructorRepo.saveAll(updatedConstructors.values());
                System.out.println("Updated " + updatedConstructors.size() + " constructors for " + context);
            }
            
            return results;
        } catch (Exception e) {
            System.err.println("Error fetching latest race results: " + e.getMessage());
            e.printStackTrace(); // Print the full stack trace for better debugging
            return null;
        }
    }
    
 
    /**
     * Gets the latest race results from the database.
     * If no results are found, it attempts to fetch them from the API.
     * 
     * @return The latest race with results
     */
    public List<Result> getLatestRaceResults() {
        try {
            // Get all races from the database
            List<Race> races = raceRepo.findAll();
            
            if (races.isEmpty()) {
                // If no races in database, fetch from API
                return fetchAndStoreLatestRaceResults();
            }
            
            // Current date in format YYYY-MM-DD
            String currentDate = java.time.LocalDate.now().toString();
            
            // Find the most recent completed race that has results
            Race latestRaceWithResults = null;
            String latestDate = "0000-00-00";
            
            for (Race race : races) {
                if (race.getResults() != null && !race.getResults().isEmpty() && 
                    race.getDate() != null && race.getDate().compareTo(currentDate) <= 0) {
                    // This race has occurred and has results
                    if (race.getDate().compareTo(latestDate) > 0) {
                        latestDate = race.getDate();
                        latestRaceWithResults = race;
                    }
                }
            }
            
            if (latestRaceWithResults != null) {
                return latestRaceWithResults.getResults();
            } else {
                // If no race with results found in database, fetch from API
                return fetchAndStoreLatestRaceResults();
            }
        } catch (Exception e) {
            System.err.println("Error getting latest race results: " + e.getMessage());
            e.printStackTrace(); // Print the full stack trace for better debugging
            return null;
        }
    }


    public void updateCircuitUrls() {
        // Get all races from the repository
        List<Race> races = raceRepo.findAll();
        if (races.isEmpty()) {
            System.out.println("No races found in the repository");
            return;
        }

        // Map of circuit round numbers to their corresponding URLs
        Map<String, String> circuitUrlMap = createCircuitUrlMap();
        int updatedCount = 0;

        for (Race race : races) {
            if (race.getCircuit() != null && race.getRound() != null) {
                String round = race.getRound();
                if (circuitUrlMap.containsKey(round)) {
                    String newUrl = circuitUrlMap.get(round);
                    race.getCircuit().setUrl(newUrl);
                    updatedCount++;
                }
            }
        }

        // Save all updated races back to the repository
        if (updatedCount > 0) {
            raceRepo.saveAll(races);
            System.out.println("Updated " + updatedCount + " circuit URLs");
        } else {
            System.out.println("No circuit URLs were updated");
        }


    }

    /**
     * Creates a mapping of race rounds to circuit URLs
     * @return Map of round numbers to circuit URLs
     */
    private Map<String, String> createCircuitUrlMap() {
        Map<String, String> map = new HashMap<>();
        
        map.put("1", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain%20carbon.png");
        map.put("2", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia%20carbon.png");
        map.put("3", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia%20carbon.png");
        map.put("4", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan%20carbon.png");
        map.put("5", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China%20carbon.png");
        map.put("6", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami%20carbon.png");
        map.put("7", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Emilia%20Romagna%20carbon.png");
        map.put("8", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Monte%20Carlo%20carbon.png");
        map.put("9", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada%20carbon.png");
        map.put("10", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain%20carbon.png");
        map.put("11", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria%20carbon.png");
        map.put("12", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain%20carbon.png");
        map.put("13", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary%20carbon.png");
        map.put("14", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Belgium%20carbon.png");
        map.put("15", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands%20carbon.png");
        map.put("16", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Italy%20carbon.png");
        map.put("17", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan%20carbon.png");
        map.put("18", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Singapore%20carbon.png");
        map.put("19", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States%20carbon.png");
        map.put("20", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Mexico%20carbon.png");
        map.put("21", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil%20carbon.png");
        map.put("22", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Las%20Vegas%20carbon.png");
        map.put("23", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Qatar%20carbon.png");
        map.put("24", "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Abu%20Dhabi%20carbon.png");
        
        return map;
    }


    public  void updateDriverImages() {
        // Map of driver _id to their new image URL
        Map<String, String> updates = Map.ofEntries(
            Map.entry("leclerc", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png"),
            Map.entry("norris", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png"),
            Map.entry("max_verstappen", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png"),
            Map.entry("russell", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png"),
            Map.entry("hamilton", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png"),
            Map.entry("kimi antonelli", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/ANDANT01_Kimi_Antonelli/andant01.png"),
            Map.entry("albon", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png"),
            Map.entry("ocon", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png"),
            Map.entry("stroll", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png"),
            Map.entry("sainz", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png"),
            Map.entry("tsunoda", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png"),
            Map.entry("gasly", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png"),
            Map.entry("hadjar", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png"),
            Map.entry("hulkenberg", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png"),
            Map.entry("bearman", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png"),
            Map.entry("alonso", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png"),
            Map.entry("lawson", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png"),
            Map.entry("bortoleto", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png"),
            Map.entry("colapinto", "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png"),
            Map.entry("piastri","https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png")
        );

        updates.forEach((driverId, url) -> {
            driverRepo.findById(driverId).ifPresent(driver -> {
                driver.setDriverImageUrl(url);
                driverRepo.save(driver);
                System.out.println("Updated driverImageUrl for: " + driverId);
            });
        });
    }

    private static final Map<String, String> colorMap = Map.of(
        "mclaren", "#FF8700",
        "mercedes", "#00D2BE",
        "red_bull", "#1E41FF",
        "ferrari", "#DC0000",
        "williams", "#005AFF",
        "haas", "#B6BABD",
        "aston_martin", "#006F62",
        "rb", "#1E41FF",           // Assuming 'rb' same as Red Bull
        "alpine", "#2293D1",
        "sauber", "#900000"
    );

    public List<Map<String, String>> getResultsByYearAndByRound(String year, String round){
        String uri = String.format("%s/%s/results.json", year, round);
        Mono<RaceResponse> response = ergastClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class);
        RaceResponse raceResponse = response.block();
        if (raceResponse != null && raceResponse.getMrData() != null && raceResponse.getMrData().getRaceTable() != null) {
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
                detailsMap.put("circuit",circuitName);
                updatedResults.add(detailsMap);
                FastestLap fastestLap = null;
                for (Result result : results) {
                    Map<String, String> resultMap = new HashMap<>();
                    resultMap.put("position", result.getPosition());
                    resultMap.put("driver", result.getDriver().getGivenName() +" "+ result.getDriver().getFamilyName());
                    resultMap.put("constructor", result.getConstructor().getName());
                    resultMap.put("points", result.getPoints());
                    resultMap.put("time", result.getTime() != null ? result.getTime().getTime() : result.getStatus());
                    if(result.getFastestLap() != null && result.getFastestLap().getRank().equals("1")){
                        fastestLap = result.getFastestLap();
                        if (fastestLap.getTime() != null) {
                            resultMap.put("fastestLap", fastestLap.getTime().getTime());
                        } else {
                            resultMap.put("fastestLap", "N/A");
                        }
                    } else {
                        resultMap.put("fastestLap", "N/A");
                    }

                    // String color = colorMap.getOrDefault(constructorName, "#000000"); // Default to black if not found                    
                    updatedResults.add(resultMap);
                }
                return updatedResults;
            }
        }
        return null;
    }
}