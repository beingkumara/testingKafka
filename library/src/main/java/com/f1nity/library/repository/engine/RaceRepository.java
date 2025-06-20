package com.f1nity.library.repository.engine;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.f1nity.library.models.engine.Race;

/**
 * Repository interface for Race entity operations.
 * Provides methods for querying race data from MongoDB.
 */
public interface RaceRepository extends MongoRepository<Race, String> {
    // Default methods from MongoRepository are sufficient for current needs
    public Race findByRound(String round);
}