package com.f1nity.library.repository.engine;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.f1nity.library.models.engine.CircuitGuide;

public interface CircuitGuideRepository extends MongoRepository<CircuitGuide, String> {
    Optional<CircuitGuide> findByCircuitId(String circuitId);
}
