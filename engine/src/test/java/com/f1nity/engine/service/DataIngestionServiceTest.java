package com.f1nity.engine.service;

import com.f1nity.engine.client.ErgastClient;
import com.f1nity.engine.client.OpenF1Client;
import com.f1nity.library.models.engine.*;
import com.f1nity.library.models.engine.ErgastConstructor.ConstructorResponse;
import com.f1nity.library.models.engine.ErgastDriver.ErgastResponse;
import com.f1nity.library.repository.engine.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class DataIngestionServiceTest {

    @Mock
    private ErgastClient ergastClient;
    @Mock
    private OpenF1Client openF1Client;
    @Mock
    private DriverRepository driverRepo;
    @Mock
    private ConstructorRepository constructorRepo;
    @Mock
    private DriverStandingsRepository driverStandingsRepo;
    @Mock
    private ConstructorStandingsRepository constructorStandingsRepo;
    @Mock
    private RaceRepository raceRepo;

    @InjectMocks
    private DataIngestionService dataIngestionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSyncAllDrivers() {
        ErgastResponse ergastResponse = new ErgastResponse();
        ergastResponse.MRData = new ErgastDriver.MRData();
        ergastResponse.MRData.DriverTable = new ErgastDriver.DriverTable();
        ErgastDriver ergDriver = new ErgastDriver();
        ergDriver.setGivenName("Max");
        ergDriver.setFamilyName("Verstappen");
        ergDriver.setDriverId("max_verstappen");
        ergastResponse.MRData.DriverTable.Drivers = Collections.singletonList(ergDriver);

        when(ergastClient.getDrivers(anyInt(), anyInt())).thenReturn(Mono.just(ergastResponse));
        when(openF1Client.getAllDrivers()).thenReturn(Mono.just(new OpenF1Driver[] {}));
        when(driverRepo.saveAll(any())).thenReturn(Collections.emptyList());

        List<Driver> drivers = dataIngestionService.syncAllDrivers();

        assertNotNull(drivers);
        assertEquals(1, drivers.size()); // Merged primarily by full name
        verify(ergastClient, times(9)).getDrivers(anyInt(), anyInt());
    }

    @Test
    void testSyncDriversWithNameNormalization() {
        // Ergast has "Andrea Kimi Antonelli"
        ErgastResponse ergastResponse = new ErgastResponse();
        ergastResponse.MRData = new ErgastDriver.MRData();
        ergastResponse.MRData.DriverTable = new ErgastDriver.DriverTable();
        ErgastDriver ergDriver = new ErgastDriver();
        ergDriver.setGivenName("Andrea Kimi");
        ergDriver.setFamilyName("Antonelli");
        ergDriver.setDriverId("kimi_antonelli"); // ID might be different
        ergastResponse.MRData.DriverTable.Drivers = Collections.singletonList(ergDriver);

        // OpenF1 has "Kimi Antonelli"
        OpenF1Driver openDriver = new OpenF1Driver();
        openDriver.setFullName("Kimi Antonelli");
        openDriver.setDriverNumber("12");
        openDriver.setHeadshotUrl("low_res.jpg");

        when(ergastClient.getDrivers(anyInt(), anyInt())).thenReturn(Mono.just(ergastResponse));
        when(openF1Client.getAllDrivers()).thenReturn(Mono.just(new OpenF1Driver[] { openDriver }));
        when(driverRepo.saveAll(any())).thenReturn(Collections.emptyList());

        List<Driver> drivers = dataIngestionService.syncAllDrivers();

        assertNotNull(drivers);
        assertEquals(1, drivers.size(), "Should merge into single driver despite name difference");
        Driver d = drivers.get(0);
        assertEquals("ANDREA KIMI ANTONELLI", d.getFullName());
        assertEquals("12", d.getDriverNumber());
        // Verify override image is used
        assertTrue(d.getDriverImageUrl().contains("wikimedia"), "Should use high-res override image");
    }

    @Test
    void testSyncAllConstructors() {
        ConstructorResponse response = new ConstructorResponse();
        response.MRData = new MRData();
        response.MRData.setConstructorTable(new ConstructorTable());
        ErgastConstructor ergConstructor = new ErgastConstructor();
        ergConstructor.setConstructorId("red_bull");
        ergConstructor.setName("Red Bull");
        response.MRData.getConstructorTable().setConstructors(Collections.singletonList(ergConstructor));

        when(ergastClient.getConstructors(anyInt(), anyInt())).thenReturn(Mono.just(response));
        when(constructorRepo.saveAll(any())).thenReturn(Collections.emptyList());

        List<Constructor> constructors = dataIngestionService.syncAllConstructors();

        assertNotNull(constructors);
        assertEquals(3, constructors.size()); // 250 / 100 ceil approx loop count adds duplicates in list
        verify(ergastClient, times(3)).getConstructors(anyInt(), anyInt());
    }

    @Test
    void testAccumulateRaces() {
        RaceResponse response = new RaceResponse();
        response.setMrData(new MRData());
        response.getMrData().setRaceTable(new RaceTable());
        response.getMrData().getRaceTable().setRaces(Collections.singletonList(new Race()));

        when(ergastClient.getRaces(anyInt())).thenReturn(response);
        when(raceRepo.saveAll(any())).thenReturn(Collections.emptyList());

        List<Race> races = dataIngestionService.accumulateRaces();

        assertNotNull(races);
        assertEquals(1, races.size());
        verify(raceRepo, atLeastOnce()).save(any());
    }

    @Test
    void testFetchAndStoreLatestRaceResultsWithSprint() {
        String round = "10";
        int year = 2025;

        // Mock GP Race Results
        RaceResponse gpResponse = new RaceResponse();
        gpResponse.setMrData(new MRData());
        gpResponse.getMrData().setRaceTable(new RaceTable());
        Race gpRace = new Race();
        gpRace.setSeason("2025");
        gpRace.setRound(round);
        Result gpResult = new Result();
        gpResult.setPoints("25");
        ErgastDriver d1 = new ErgastDriver();
        d1.setDriverId("d1");
        ErgastConstructor c1 = new ErgastConstructor();
        c1.setConstructorId("c1");
        gpResult.setDriver(d1);
        gpResult.setConstructor(c1);
        gpRace.setResults(Collections.singletonList(gpResult));
        gpResponse.getMrData().getRaceTable().setRaces(Collections.singletonList(gpRace));

        // Mock Sprint Results
        RaceResponse sprintResponse = new RaceResponse();
        sprintResponse.setMrData(new MRData());
        sprintResponse.getMrData().setRaceTable(new RaceTable());
        Race sprintRace = new Race(); // Represents the sprint part
        Result sprintResult = new Result();
        sprintResult.setPoints("8");
        sprintResult.setDriver(d1);
        sprintResult.setConstructor(c1);
        sprintRace.setSprintResults(Collections.singletonList(sprintResult));
        sprintResponse.getMrData().getRaceTable().setRaces(Collections.singletonList(sprintRace));

        // Mocks
        when(ergastClient.getRaceResults(year, round)).thenReturn(gpResponse);
        when(ergastClient.getSprintResults(year, round)).thenReturn(sprintResponse);

        when(raceRepo.findBySeasonAndRound("2025", round)).thenReturn(new ArrayList<>());
        Driver initialDriver = new Driver();
        initialDriver.setPoints(0.0); // Initialize points to avoid NPE
        initialDriver.setWins(0);
        initialDriver.setPodiums(0);
        initialDriver.setTotalRaces(0);
        when(driverRepo.findById("d1")).thenReturn(Optional.of(initialDriver));

        Constructor initialConstructor = new Constructor();
        initialConstructor.setPoints(0.0);
        initialConstructor.setWins(0);
        initialConstructor.setPodiums(0);
        initialConstructor.setTotalRaces(0);
        when(constructorRepo.findById("c1")).thenReturn(Optional.of(initialConstructor));

        dataIngestionService.fetchAndStoreLatestRaceResults(round);

        // Verify points accumulation: 25 (GP) + 8 (Sprint) = 33
        // The service updates 'updatedDrivers' map and saves them.
        verify(driverRepo).saveAll(argThat(drivers -> {
            for (Driver d : drivers) {
                // Check for generic 0.0 vs 33.0 comparison
                if (Math.abs(d.getPoints() - 33.0) < 0.001)
                    return true;
            }
            return false;
        }));
    }
}
