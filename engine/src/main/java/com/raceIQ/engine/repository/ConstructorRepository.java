package com.raceIQ.engine.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.raceIQ.engine.model.Constructor;

public interface ConstructorRepository extends MongoRepository<Constructor, String> {

    public Constructor findByConstructorId(String constructorId);

    
}
