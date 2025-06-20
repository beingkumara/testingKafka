package com.raceIQ.authentication.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.access.prepost.PreAuthorize;

import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.models.news.NewsArticle;

import com.raceIQ.authentication.service.F1nityEngineService;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
public class F1nityEngineController {
    
    private final F1nityEngineService f1nityEngineService;
    
    public F1nityEngineController(F1nityEngineService f1nityEngineService) {
        this.f1nityEngineService = f1nityEngineService;
    }
    
    @GetMapping("/driver-standings")
    @PreAuthorize("isAuthenticated()")
    public List<DriverStanding> getDriverStandings() {
        return f1nityEngineService.getDriverStandings();
    }

    @GetMapping("/constructor-standings")
    @PreAuthorize("isAuthenticated()")
    public List<ConstructorStanding> getConstructorStandings() {
        return f1nityEngineService.getConstructorStandings();
    }

    @GetMapping("/results/{year}/{round}")
    @PreAuthorize("isAuthenticated()")
    public List<Map<String, String>> getResults(@PathVariable String year, @PathVariable String round) {
        return f1nityEngineService.getResults(year, round);
    }
    
    @GetMapping("/races/{id}")
    @PreAuthorize("isAuthenticated()")
    public Race getRaceById(@PathVariable String id) {
        return f1nityEngineService.getRaceById(id);
    }

    @GetMapping("/races")
    @PreAuthorize("isAuthenticated()")
    public List<Race> getAllRaces() {
        return f1nityEngineService.getAllRaces();
    }
    
    @GetMapping("/drivers/{driverId}")
    @PreAuthorize("isAuthenticated()")
    public Driver getDriverById(@PathVariable String driverId) {
        return f1nityEngineService.getDriverById(driverId);
    }
    
    @GetMapping("/current-drivers")
    @PreAuthorize("isAuthenticated()")
    public List<Driver> getCurrentDrivers() {
        return f1nityEngineService.getCurrentDrivers();
    }
    
    @GetMapping("/latest-race-results")
    @PreAuthorize("isAuthenticated()")
    public List<Result> getLatestRaceResults() {
        return f1nityEngineService.getLatestRaceResults();
    }
    
    @GetMapping("/news/latest")
    @PreAuthorize("isAuthenticated()")
    public List<NewsArticle> getLatestNews(@RequestParam String ticket, @RequestParam String fromDate, @RequestParam String toDate, @RequestParam int page, @RequestParam int pageSize) {
        return f1nityEngineService.getLatestNews(ticket, fromDate, toDate, page, pageSize);
    }
}
