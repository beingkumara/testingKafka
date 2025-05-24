package com.raceIQ.engine.impl;

import com.raceIQ.engine.repository.DriverRepository;
import com.raceIQ.engine.repository.RaceRepository;
import com.raceIQ.engine.model.Driver;
import com.raceIQ.engine.model.Race;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class F1nityServiceImpl{


    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private RaceRepository raceRepo;

    @Autowired
    private FastF1 fastF1;

    public List<Driver> getCurrentDrivers(){
        Map<String,String> driverMap = fastF1.getCurrentDriversId();
        List<Driver> drivers =  new ArrayList<>();
        for (String driverNumber : driverMap.keySet()){
            String fullName = driverMap.get(driverNumber);
            Driver driver = driverRepo.findDriverByDriverNumberAndFullName(driverNumber, fullName);
            drivers.add(driver);
        }
        return drivers;
    }

    public List<Race> getRacesOfCurrentYear(){
        List<Race> races = raceRepo.findAll();
        return races;
    }

}