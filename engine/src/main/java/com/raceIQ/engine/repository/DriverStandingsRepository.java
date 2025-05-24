package com.raceIQ.engine.repository;

import com.raceIQ.engine.model.DriverStanding;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DriverStandingsRepository extends MongoRepository<DriverStanding, String> {
}