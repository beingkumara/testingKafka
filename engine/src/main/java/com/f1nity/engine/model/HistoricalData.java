package com.f1nity.engine.model;

import java.util.List;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Constructor;

/**
 * DTO for serializing/deserializing historical data from JSON.
 */
public class HistoricalData {
    private List<Driver> drivers;
    private List<Constructor> constructors;
    private String lastUpdated;

    public List<Driver> getDrivers() {
        return drivers;
    }

    public void setDrivers(List<Driver> drivers) {
        this.drivers = drivers;
    }

    public List<Constructor> getConstructors() {
        return constructors;
    }

    public void setConstructors(List<Constructor> constructors) {
        this.constructors = constructors;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
