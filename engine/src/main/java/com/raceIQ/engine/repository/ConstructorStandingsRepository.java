package com.raceIQ.engine.repository;

import com.raceIQ.engine.model.ConstructorStanding;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConstructorStandingsRepository extends MongoRepository<ConstructorStanding, String> {
}