package com.raceIQ.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.Race;

public interface RaceRepository extends MongoRepository<Race, String>   {
    
}
