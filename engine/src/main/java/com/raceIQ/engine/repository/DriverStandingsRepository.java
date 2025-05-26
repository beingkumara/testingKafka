package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.DriverStanding;

/**
 * Repository interface for DriverStanding entity operations.
 * Provides methods for querying driver standings data from MongoDB.
 */
public interface DriverStandingsRepository extends MongoRepository<DriverStanding, String> {
    // Default methods from MongoRepository are sufficient for current needs
}