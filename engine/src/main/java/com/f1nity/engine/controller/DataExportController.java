package com.f1nity.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.engine.service.DataIngestionService;

@RestController
@RequestMapping(value = "/api/v1")
public class DataExportController {

    @Autowired
    private DataIngestionService dataIngestionService;

    @GetMapping("/export-data")
    public String exportData() {
        dataIngestionService.exportData();
        return "Data export initiated to src/main/resources/historical_data.json";
    }

    @GetMapping("/import-data")
    public String importData() {
        return dataIngestionService.importHistoricalData();
    }

    @GetMapping("/cleanup-data")
    public String cleanupData() {
        return dataIngestionService.cleanupBadDrivers();
    }
}
