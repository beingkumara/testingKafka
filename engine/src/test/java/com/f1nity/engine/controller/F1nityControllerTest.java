package com.f1nity.engine.controller;

import com.f1nity.engine.service.DataIngestionService;
import com.f1nity.engine.service.F1nityService;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.Race;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class F1nityControllerTest {

    @Mock
    private DataIngestionService dataIngestionService;

    @Mock
    private F1nityService f1nityService;

    @InjectMocks
    private F1nityController f1nityController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDrivers() {
        when(f1nityService.getAllDrivers()).thenReturn(Arrays.asList(new Driver(), new Driver()));

        List<Driver> drivers = f1nityController.getAllDrivers();

        assertNotNull(drivers);
        assertEquals(2, drivers.size());
        verify(f1nityService).getAllDrivers();
    }

    @Test
    void testGetCurrentDrivers() {
        when(f1nityService.getCurrentDrivers()).thenReturn(Arrays.asList(new Driver()));

        List<Driver> drivers = f1nityController.getCurrentDrivers();

        assertNotNull(drivers);
        assertEquals(1, drivers.size());
        verify(f1nityService).getCurrentDrivers();
    }

    @Test
    void testGetDriverById() {
        String driverId = "max_verstappen";
        Driver mockDriver = new Driver();
        when(f1nityService.getDriverById(driverId)).thenReturn(mockDriver);

        Driver driver = f1nityController.getDriverById(driverId);

        assertNotNull(driver);
        verify(f1nityService).getDriverById(driverId);
    }

    @Test
    void testGetAllRaces() {
        when(f1nityService.getRacesOfCurrentYear()).thenReturn(Arrays.asList(new Race(), new Race()));

        List<Race> races = f1nityController.getAllRaces();

        assertNotNull(races);
        assertEquals(2, races.size());
        verify(f1nityService).getRacesOfCurrentYear();
    }

    @Test
    void testAccumulateRaces() {
        when(dataIngestionService.accumulateRaces()).thenReturn(Arrays.asList(new Race()));

        List<Race> races = f1nityController.accumulateRaces();

        assertNotNull(races);
        verify(dataIngestionService).accumulateRaces();
    }

    @Test
    void testGetDriverStandings() {
        when(f1nityService.getDriverStandings()).thenReturn(Arrays.asList(new DriverStanding()));

        List<DriverStanding> standings = f1nityController.getDriverStandings();

        assertNotNull(standings);
        verify(f1nityService).getDriverStandings();
    }
}
