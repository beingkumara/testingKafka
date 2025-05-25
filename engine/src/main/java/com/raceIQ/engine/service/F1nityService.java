package com.raceIQ.engine.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raceIQ.engine.impl.F1nityServiceImpl;
import com.raceIQ.engine.impl.FastF1;
import com.raceIQ.engine.model.Driver;
import com.raceIQ.engine.model.Race;

@Service
public class F1nityService {

    private final FastF1 fastF1;
    
    @Autowired
    private F1nityServiceImpl f1nityServiceImpl;


    F1nityService(FastF1 fastF1) {
        this.fastF1 = fastF1;
    }


    public List<Driver> getCurrentDrivers(){
        return f1nityServiceImpl.getCurrentDrivers();
    }

    public List<Race> getRacesOfCurrentYear(){
        return f1nityServiceImpl.getRacesOfCurrentYear();
    }
    
    /**
     * Updates the circuit URLs for all races in the repository
     * @return Number of races updated
     */
    public void updateCircuitUrls() {
        fastF1.updateCircuitUrls();
    }


    public Driver getDriverById(String driverId) {
        return f1nityServiceImpl.getDriverById(driverId);
    }
}
