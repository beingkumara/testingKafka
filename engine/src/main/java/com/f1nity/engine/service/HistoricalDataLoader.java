package com.f1nity.engine.service;

import com.f1nity.engine.model.HistoricalData;
import com.f1nity.library.models.engine.Constructor;
import com.f1nity.library.models.engine.Driver;
import com.f1nity.library.repository.engine.ConstructorRepository;
import com.f1nity.library.repository.engine.DriverRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class HistoricalDataLoader {

    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private ConstructorRepository constructorRepo;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String HISTORY_FILE = "historical_data.json";

    public String loadHistoricalData() {
        StringBuilder status = new StringBuilder();
        try {
            // Try loading from source file first for dev loop
            String userDir = System.getProperty("user.dir");
            status.append("CWD: ").append(userDir).append("\n");

            File sourceFile = new File("src/main/resources/" + HISTORY_FILE);
            if (!sourceFile.exists()) {
                sourceFile = new File("engine/src/main/resources/" + HISTORY_FILE);
            }

            HistoricalData data;
            if (sourceFile.exists()) {
                status.append("Loaded from SOURCE: ").append(sourceFile.getAbsolutePath()).append("\n");
                data = objectMapper.readValue(sourceFile, HistoricalData.class);
            } else {
                status.append("Source file not found at src/main/resources/").append(HISTORY_FILE)
                        .append(" or engine/src/main/resources/").append(HISTORY_FILE).append("\n");

                // Fallback to classpath resource (prod / packaged jar)
                ClassPathResource resource = new ClassPathResource(HISTORY_FILE);
                if (!resource.exists()) {
                    return status.append("Failed: Classpath resource not found.").toString();
                }
                status.append("Loaded from CLASSPATH (might be stale).\n");
                data = objectMapper.readValue(resource.getInputStream(), HistoricalData.class);
            }

            if (data.getDrivers() != null && !data.getDrivers().isEmpty()) {
                status.append("Saving ").append(data.getDrivers().size()).append(" drivers... ");
                driverRepo.saveAll(data.getDrivers());
                status.append("Done.\n");
                // Debug: Check one driver
                Driver d = data.getDrivers().stream().filter(dr -> "leclerc".equals(dr.getDriverId())).findFirst()
                        .orElse(null);
                if (d != null)
                    status.append("Leclerc Wins: ").append(d.getWins()).append("\n");
            }

            if (data.getConstructors() != null && !data.getConstructors().isEmpty()) {
                constructorRepo.saveAll(data.getConstructors());
            }

            return status.toString();

        } catch (IOException e) {
            e.printStackTrace();
            return status.append("Error: ").append(e.getMessage()).toString();
        }
    }

    public void exportDataToJSON() {
        try {
            HistoricalData data = new HistoricalData();
            data.setDrivers(driverRepo.findAll());
            data.setConstructors(constructorRepo.findAll());
            data.setLastUpdated(LocalDateTime.now().toString());

            // Write to src/main/resources so it's picked up on next run mostly for dev
            // convenience
            // In a real prod env you might want to write to an external volume or just a
            // temp file to download.
            // For now, let's write to a known path.
            File file = new File("src/main/resources/" + HISTORY_FILE);
            // If running in docker/jar, this path might not be writable or meaningful as
            // expected,
            // but for local dev (which seems to be the case here) it works.

            // Fallback if src/main/resources doesn't exist (e.g. running from different
            // CWD)
            if (!file.getParentFile().exists()) {
                file = new File("engine/src/main/resources/" + HISTORY_FILE);
            }

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, data);
            System.out.println("Data exported to " + file.getAbsolutePath());

        } catch (IOException e) {
            System.err.println("Error exporting data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
