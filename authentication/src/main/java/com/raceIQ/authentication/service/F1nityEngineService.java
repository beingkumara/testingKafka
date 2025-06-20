package com.raceIQ.authentication.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.models.news.NewsArticle;

import com.raceIQ.authentication.client.F1nityEngineClient;

@Service
public class F1nityEngineService {
    
    private final F1nityEngineClient f1nityEngineClient;
    
    public F1nityEngineService(F1nityEngineClient f1nityEngineClient) {
        this.f1nityEngineClient = f1nityEngineClient;
    }
    
    public List<DriverStanding> getDriverStandings() {
        return f1nityEngineClient.getDriverStandings();
    }
    
    public List<ConstructorStanding> getConstructorStandings() {
        return f1nityEngineClient.getConstructorStandings();
    }
    
    public List<Map<String, String>> getResults(String year, String round) {
        return f1nityEngineClient.getResults(year, round);
    }
    
    public Race getRaceById(String id) {
        return f1nityEngineClient.getRaceById(id);
    }
    
    public List<Race> getAllRaces() {
        return f1nityEngineClient.getAllRaces();
    }
    
    public Driver getDriverById(String driverId) {
        return f1nityEngineClient.getDriverById(driverId);
    }
    
    public List<Driver> getCurrentDrivers() {
        return f1nityEngineClient.getCurrentDrivers();
    }
    
    public List<Result> getLatestRaceResults() {
        return f1nityEngineClient.getLatestRaceResults();
    }
    
    public List<NewsArticle> getLatestNews(String ticket, String fromDate, String toDate, int page, int pageSize) {
        return f1nityEngineClient.getLatestNews(ticket, fromDate, toDate, page, pageSize);
    }
}
