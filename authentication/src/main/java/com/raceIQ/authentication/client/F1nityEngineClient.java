package com.raceIQ.authentication.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import com.raceIQ.authentication.config.FeignConfig;

import com.f1nity.library.models.engine.DriverStanding;
import com.f1nity.library.models.engine.ConstructorStanding;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.models.engine.Result;
import com.f1nity.library.models.news.NewsArticle;

@FeignClient(name = "f1nityEngineClient", url = "${f1engine.url}", configuration = FeignConfig.class)
public interface F1nityEngineClient {
    
    @GetMapping("/driver-standings")
    public List<DriverStanding> getDriverStandings();

    @GetMapping("/constructor-standings")
    public List<ConstructorStanding> getConstructorStandings();

    @GetMapping("/results/{year}/{round}")
    public List<Map<String, String>> getResults(@PathVariable String year, @PathVariable String round);

    @GetMapping("/races/{id}")
    public Race getRaceById(@PathVariable String id);

    @GetMapping("/races")
    public List<Race> getAllRaces();

    @GetMapping("/drivers/{driverId}")
    public Driver getDriverById(@PathVariable String driverId);

    @GetMapping("/currentDrivers")
    public List<Driver> getCurrentDrivers();

    @GetMapping("/latest-race-results")
    public List<Result> getLatestRaceResults();

    @GetMapping("/news/latest")
    public List<NewsArticle> getLatestNews(@RequestParam String ticket, @RequestParam String fromDate, @RequestParam String toDate, @RequestParam int page, @RequestParam int pageSize);



}
