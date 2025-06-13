package com.raceIQ.engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the F1 data engine.
 * Enables scheduling for periodic data updates.
 */
@SpringBootApplication
@EnableScheduling
@EnableFeignClients(basePackages = "com.raceIQ.engine.client")
public class EngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(EngineApplication.class, args);
    }
}