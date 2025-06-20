package com.raceIQ.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.f1nity.library.models.engine.Driver;

/**
 * Repository interface for Driver entity operations.
 * Provides methods for querying driver data from MongoDB.
 */
public interface DriverRepository extends MongoRepository<Driver, String> {
    
    /**
     * Find drivers by their driver number.
     * 
     * @param driverNumber The driver number to search for
     * @return List of drivers with the specified number
     */
    List<Driver> findByDriverNumber(String driverNumber);
    
    /**
     * Find drivers by their team name.
     * 
     * @param teamName The team name to search for
     * @return List of drivers in the specified team
     */
    List<Driver> findByTeamName(String teamName);
    
    /**
     * Check if a driver with the specified number exists.
     * 
     * @param driverNumber The driver number to check
     * @return True if a driver with the number exists, false otherwise
     */
    boolean existsByDriverNumber(String driverNumber);
    
    /**
     * Find a driver by their ID.
     * 
     * @param driverId The driver ID to search for
     * @return The driver with the specified ID
     */
    Driver findByDriverId(String driverId);
    
    /**
     * Find drivers by their active status.
     * 
     * @param isActive The active status to search for
     * @return List of drivers with the specified active status
     */
    List<Driver> findDriverByIsActive(boolean isActive);
    
    /**
     * Find a driver by their number and full name.
     * 
     * @param driverNumber The driver number to search for
     * @param fullName The full name to search for
     * @return The driver with the specified number and name
     */
    Driver findDriverByDriverNumberAndFullName(String driverNumber, String fullName);
}