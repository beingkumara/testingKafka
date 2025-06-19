package com.raceIQ.authentication.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.raceIQ.authentication.config.FeignConfig;
@FeignClient(name = "f1nityEngineClient", url = "${f1engine.url}", configuration = FeignConfig.class)
public interface F1nityEngineClient {
    
    @GetMapping("/driver-standings")
    public String getDriverStandings();
}
