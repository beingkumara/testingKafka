package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.Constructor;

/**
 * Repository interface for Constructor entity operations.
 * Provides methods for querying constructor data from MongoDB.
 */
public interface ConstructorRepository extends MongoRepository<Constructor, String> {
    
    /**
     * Find a constructor by its ID.
     * 
     * @param constructorId The constructor ID to search for
     * @return The constructor with the specified ID
     */
    Constructor findByConstructorId(String constructorId);
}