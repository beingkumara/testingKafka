package com.f1nity.engine.client;

import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import com.f1nity.library.models.engine.OpenF1Driver;

import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Component
public class OpenF1Client {

    private final String OPEN_F1 = "https://api.openf1.org/v1/";
    private final WebClient webClient;

    public OpenF1Client(WebClient.Builder builder) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();

        this.webClient = builder
                .baseUrl(OPEN_F1)
                .exchangeStrategies(strategies)
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
    }

    public Mono<OpenF1Driver[]> getAllDrivers() {
        return webClient.get()
                .uri("drivers")
                .retrieve()
                .bodyToMono(OpenF1Driver[].class);
    }

    public Mono<OpenF1Driver[]> getSessionDrivers(String meetingKey, String sessionKey) {
        String uri = String.format("drivers?meeting_key=%s&session_key=%s", meetingKey, sessionKey);
        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(OpenF1Driver[].class);
    }
}
