package com.f1nity.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.engine.service.CircuitGuideService;
import com.f1nity.library.models.engine.CircuitGuide;

@RestController
@RequestMapping("/api/v1/guides")
public class CircuitGuideController {

    @Autowired
    private CircuitGuideService service;

    @GetMapping("/{circuitId}")
    public CircuitGuide getGuide(@PathVariable String circuitId) {
        return service.getGuideByCircuitId(circuitId);
    }
}
