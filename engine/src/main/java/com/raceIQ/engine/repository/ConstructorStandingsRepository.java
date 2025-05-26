package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.ConstructorStanding;

/**
 * Repository interface for ConstructorStanding entity operations.
 * Provides methods for querying constructor standings data from MongoDB.
 */
public interface ConstructorStandingsRepository extends MongoRepository<ConstructorStanding, String> {
    // Default methods from MongoRepository are sufficient for current needs
}