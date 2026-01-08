package com.f1nity.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.engine.service.F1nityService;
import com.f1nity.engine.service.WeatherService;
import com.f1nity.library.models.engine.Race;
import com.f1nity.library.models.engine.WeatherResponse;

@RestController
@RequestMapping("/api/v1/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private F1nityService f1nityService;

    @GetMapping("/coordinates")
    public WeatherResponse getWeatherByCoordinates(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getWeather(lat, lon);
    }

    @GetMapping("/{raceId}")
    public WeatherResponse getWeatherByRaceId(@PathVariable String raceId) {
        Race race = f1nityService.getRaceById(raceId);
        if (race != null && race.getCircuit() != null && race.getCircuit().getLocation() != null) {
            try {
                double lat = Double.parseDouble(race.getCircuit().getLocation().getLat());
                double lon = Double.parseDouble(race.getCircuit().getLocation().getLong());
                return weatherService.getWeather(lat, lon);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid coordinates for race: " + raceId);
            }
        }
        throw new RuntimeException("Race or location not found for id: " + raceId);
    }
}
