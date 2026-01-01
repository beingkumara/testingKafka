package com.f1nity.engine.controller;

import com.f1nity.library.models.news.NewsArticle;
import com.f1nity.engine.service.NewsService;
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
            @RequestParam(required = false) String to,
            @RequestParam(required = false) int page,
            @RequestParam(required  = false) int pageSize) {
        
        // Set default values if not provided
        String query = ticket != null ? ticket : "F1";
        String fromDate = from != null ? from : LocalDate.now().minusDays(7).format(dateFormatter);
        String toDate = to != null ? to : LocalDate.now().format(dateFormatter);
        
        return newsService.getNews(query, fromDate, toDate, page, pageSize);
    }

    @GetMapping("/clear-all")
    public String clearAllNews() {
        newsService.clearAllNews();
        return "All news cleared";
    }
}
