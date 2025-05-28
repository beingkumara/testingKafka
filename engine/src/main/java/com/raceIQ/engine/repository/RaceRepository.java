package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.Race;

/**
 * Repository interface for Race entity operations.
 * Provides methods for querying race data from MongoDB.
 */
public interface RaceRepository extends MongoRepository<Race, String> {
    // Default methods from MongoRepository are sufficient for current needs
    public Race findByRound(String round);
}