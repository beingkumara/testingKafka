package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.Driver;

import java.util.List;

public interface DriverRepository extends MongoRepository<Driver, String> {
    List<Driver> findByDriverNumber(String driverNumber);
    List<Driver> findByTeamName(String teamName);
    boolean existsByDriverNumber(String driverNumber);
    Driver findByDriverId(String driverId);
    List<Driver> findDriverByIsActive(boolean isActive);

    Driver findDriverByDriverNumberAndFullName(String driverNumber, String fullName);

    
}
