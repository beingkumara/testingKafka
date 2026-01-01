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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
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
        verify(raceRepo).saveAll(any());
    }

    @Test
    void testGetCurrentDriversId() {
        OpenF1Driver driver = new OpenF1Driver();
        driver.setDriverNumber("1");
        driver.setFullName("Max Verstappen");
        when(openF1Client.getSessionDrivers(anyString(), anyString()))
                .thenReturn(Mono.just(new OpenF1Driver[] { driver }));

        Map<String, String> drivers = dataIngestionService.getCurrentDriversId();

        assertNotNull(drivers);
        assertEquals(1, drivers.size());
        assertEquals("MAX VERSTAPPEN", drivers.get("1"));
    }
}
