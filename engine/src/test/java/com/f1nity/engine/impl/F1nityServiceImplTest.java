package com.f1nity.engine.impl;

import com.f1nity.engine.client.ErgastClient;
import com.f1nity.engine.service.DataIngestionService;
import com.f1nity.library.models.engine.*;
import com.f1nity.library.repository.engine.ConstructorStandingsRepository;
import com.f1nity.library.repository.engine.DriverRepository;
import com.f1nity.library.repository.engine.DriverStandingsRepository;
import com.f1nity.library.repository.engine.RaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class F1nityServiceImplTest {

    @Mock
    private DriverRepository driverRepo;
    @Mock
    private RaceRepository raceRepo;
    @Mock
    private DataIngestionService dataIngestionService;
    @Mock
    private ErgastClient ergastClient;
    @Mock
    private DriverStandingsRepository driverStandingsRepo;
    @Mock
    private ConstructorStandingsRepository constructorStandingsRepo;

    @InjectMocks
    private F1nityServiceImpl f1nityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCurrentDrivers() {
        Map<String, String> driverMap = Collections.singletonMap("1", "Max Verstappen");
        when(dataIngestionService.getCurrentDriversId()).thenReturn(driverMap);
        when(driverRepo.findDriverByDriverNumberAndFullName("1", "Max Verstappen")).thenReturn(new Driver());

        List<Driver> drivers = f1nityService.getCurrentDrivers();

        assertNotNull(drivers);
        assertEquals(1, drivers.size());
        verify(dataIngestionService).getCurrentDriversId();
    }

    @Test
    void testGetRacesOfCurrentYear() {
        when(raceRepo.findAll()).thenReturn(Arrays.asList(new Race()));

        List<Race> races = f1nityService.getRacesOfCurrentYear();

        assertNotNull(races);
        assertEquals(1, races.size());
        verify(raceRepo).findAll();
    }

    @Test
    void testGetDriverById() {
        String driverId = "max_verstappen";
        when(driverRepo.findById(driverId)).thenReturn(Optional.of(new Driver()));

        Driver driver = f1nityService.getDriverById(driverId);

        assertNotNull(driver);
        verify(driverRepo).findById(driverId);
    }

    @Test
    void testGetResultsByYearAndByRound() {
        String year = "2023";
        String round = "1";

        RaceResponse raceResponse = new RaceResponse();
        MRData mrData = new MRData();
        RaceTable raceTable = new RaceTable();
        Race race = new Race();
        race.setRaceName("Bahrain Grand Prix");
        race.setDate("2023-03-05");

        Result result = new Result();
        result.setPosition("1");
        result.setPoints("25");
        result.setStatus("Finished");
        ErgastDriver driver = new ErgastDriver();
        driver.setGivenName("Max");
        driver.setFamilyName("Verstappen");
        result.setDriver(driver);
        ErgastConstructor constructor = new ErgastConstructor();
        constructor.setName("Red Bull");
        result.setConstructor(constructor);

        race.setResults(Collections.singletonList(result));
        raceTable.setRaces(Collections.singletonList(race));
        mrData.setRaceTable(raceTable);
        raceResponse.setMrData(mrData);

        when(ergastClient.getRaceResultsMono(year, round)).thenReturn(Mono.just(raceResponse));

        List<Map<String, String>> results = f1nityService.getResultsByYearAndByRound(year, round);

        assertNotNull(results);
        assertTrue(results.size() > 1); // 1 for details, 1 for result
        assertEquals("Bahrain Grand Prix", results.get(0).get("circuit"));
    }

    @Test
    void testGetRaceById() {
        String raceId = "1";
        when(raceRepo.findById(raceId)).thenReturn(Optional.of(new Race()));

        Race race = f1nityService.getRaceById(raceId);

        assertNotNull(race);
        verify(raceRepo).findById(raceId);
    }

    @Test
    void testGetDriverStandings() {
        when(driverStandingsRepo.findAll(any(Sort.class))).thenReturn(Arrays.asList(new DriverStanding()));

        List<DriverStanding> standings = f1nityService.getDriverStandings();

        assertNotNull(standings);
        verify(driverStandingsRepo).findAll(any(Sort.class));
    }

    @Test
    void testGetConstructorStandings() {
        when(constructorStandingsRepo.findAll(any(Sort.class))).thenReturn(Arrays.asList(new ConstructorStanding()));

        List<ConstructorStanding> standings = f1nityService.getConstructorStandings();

        assertNotNull(standings);
        verify(constructorStandingsRepo).findAll(any(Sort.class));
    }
}
