package com.raceIQ.engine.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.raceIQ.engine.impl.F1nityServiceImpl;
import com.raceIQ.engine.model.Driver;
import com.raceIQ.engine.model.Race;

@Service
public class F1nityService {
    

    @Autowired
    private F1nityServiceImpl f1nityServiceImpl;


    public List<Driver> getCurrentDrivers(){
        return f1nityServiceImpl.getCurrentDrivers();
    }

    public List<Race> getRacesOfCurrentYear(){
        return f1nityServiceImpl.getRacesOfCurrentYear();
    }
    
}
