package com.f1nity.engine.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.f1nity.library.models.engine.WeatherResponse;

@Service
public class WeatherService {

    private final WebClient webClient;

    public WeatherService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.open-meteo.com/v1").build();
    }

    public WeatherResponse getWeather(double latitude, double longitude) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/forecast")
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("current_weather", true)
                        .build())
                .retrieve()
                .bodyToMono(WeatherResponse.class)
                .block();
    }
}
