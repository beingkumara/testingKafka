package com.raceIQ.engine.controller;

import com.raceIQ.engine.model.NewsArticle;
import com.raceIQ.engine.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
public class NewsController {

    private final NewsService newsService;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE;

    @Autowired
    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/latest")
    public List<NewsArticle> getLatestF1News(
            @RequestParam(required = false) String ticket,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        
        // Set default values if not provided
        String query = ticket != null ? ticket : "F1";
        String fromDate = from != null ? from : LocalDate.now().minusDays(7).format(dateFormatter);
        String toDate = to != null ? to : LocalDate.now().format(dateFormatter);
        
        return newsService.getLatestF1News(query, fromDate, toDate);
    }
}
