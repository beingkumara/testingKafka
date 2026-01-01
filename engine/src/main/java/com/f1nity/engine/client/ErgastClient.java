package com.f1nity.engine.client;

import java.util.function.Supplier;

import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.Builder;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.f1nity.library.models.engine.ErgastConstructor.ConstructorResponse;
import com.f1nity.library.models.engine.ErgastDriver.ErgastResponse;
import com.f1nity.library.models.engine.ErgastDriverStandingsResponse;
import com.f1nity.library.models.engine.ErgastConstructorStandingsResponse;
import com.f1nity.library.models.engine.RaceResponse;

import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Component
public class ErgastClient {

    private final String ERGAST_F1 = "https://api.jolpi.ca/ergast/f1/";
    private final WebClient webClient;

    public ErgastClient(WebClient.Builder builder) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();

        this.webClient = builder
                .baseUrl(ERGAST_F1)
                .exchangeStrategies(strategies)
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
    }

    public Mono<ErgastResponse> getDrivers(int limit, int offset) {
        String uri = String.format("drivers.json?limit=%d&offset=%d", limit, offset);
        return webClient.get().uri(uri).retrieve().bodyToMono(ErgastResponse.class);
    }

    public Mono<ConstructorResponse> getConstructors(int limit, int offset) {
        String uri = String.format("constructors.json?limit=%d&offset=%d", limit, offset);
        return webClient.get().uri(uri).retrieve().bodyToMono(ConstructorResponse.class);
    }

    public RaceResponse getRaceResults(int year, int round) {
        String uri = String.format("%d/%d/results.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "race results for year " + year + " round " + round);
    }

    public RaceResponse getRaceResults(int year, String round) {
        String uri = String.format("%d/%s/results.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "race results for year " + year + " round " + round);
    }

    public RaceResponse getQualifyingResults(int year, int round) {
        String uri = String.format("%d/%d/qualifying.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "qualifying results for year " + year + " round " + round);
    }

    public RaceResponse getQualifyingResults(int year, String round) {
        String uri = String.format("%d/%s/qualifying.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "qualifying results for year " + year + " round " + round);
    }

    public RaceResponse getSprintResults(int year, int round) {
        String uri = String.format("%d/%d/sprint.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "sprint results for year " + year + " round " + round);
    }

    public RaceResponse getSprintResults(int year, String round) {
        String uri = String.format("%d/%s/sprint.json", year, round);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class),
                "sprint results for year " + year + " round " + round);
    }

    public ErgastDriverStandingsResponse getDriverStandings(int year) {
        String uri = String.format("%d/driverstandings.json", year);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(ErgastDriverStandingsResponse.class),
                "driver standings for " + year);
    }

    public ErgastConstructorStandingsResponse getConstructorStandings(int year) {
        String uri = String.format("%d/constructorstandings.json", year);
        return fetchWithRetry(
                () -> webClient.get().uri(uri).retrieve().bodyToMono(ErgastConstructorStandingsResponse.class),
                "constructor standings for " + year);
    }

    public RaceResponse getRaces(int year) {
        String uri = String.format("%d/races.json", year);
        return webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class).block();
    }

    public Mono<RaceResponse> getRaceResultsMono(String year, String round) {
        String uri = String.format("%s/%s/results.json", year, round);
        return webClient.get().uri(uri).retrieve().bodyToMono(RaceResponse.class);
    }

    private <T> T fetchWithRetry(Supplier<Mono<T>> monoSupplier, String contextForLogging) {
        int retryCount = 0;
        int maxRetries = 5;
        long waitTimeMillis = 60000; // Start with 60 seconds for Ergast

        while (retryCount <= maxRetries) {
            try {
                return monoSupplier.get().block(); // Blocking call
            } catch (WebClientResponseException e) {
                if (e.getRawStatusCode() == 429 && retryCount < maxRetries) {
                    retryCount++;
                    System.out.println("Rate limit (429) for " + contextForLogging +
                            ". Retry " + retryCount + "/" + maxRetries +
                            ". Waiting for " + (waitTimeMillis / 1000) + " seconds...");
                    try {
                        Thread.sleep(waitTimeMillis);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        System.err.println("Retry sleep interrupted for " + contextForLogging);
                        throw e;
                    }
                    waitTimeMillis *= 2; // Exponential backoff
                } else if (e.getRawStatusCode() == 404 || e.getRawStatusCode() == 503) {
                    System.out.println("API returned " + e.getRawStatusCode() + " for " + contextForLogging
                            + ". Assuming no data. Message: " + e.getMessage());
                    return null; // Treat as no data available
                } else {
                    System.err.println("Non-retryable WebClientResponseException for " + contextForLogging + ": "
                            + e.getRawStatusCode() + " - " + e.getMessage());
                    throw e;
                }
            } catch (Exception e) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    System.out.println("General error for " + contextForLogging +
                            ". Retry " + retryCount + "/" + maxRetries +
                            ". Waiting for " + (waitTimeMillis / 1000) + " seconds... Error: " + e.getMessage());
                    try {
                        Thread.sleep(waitTimeMillis);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        System.err.println("Retry sleep interrupted for " + contextForLogging);
                        throw e;
                    }
                    waitTimeMillis *= 1.5;
                } else {
                    System.err.println(
                            "General error after max retries for " + contextForLogging + ": " + e.getMessage());
                    throw e;
                }
            }
        }
        System.err.println("Max retries reached for " + contextForLogging + ". Returning null.");
        return null;
    }
}
