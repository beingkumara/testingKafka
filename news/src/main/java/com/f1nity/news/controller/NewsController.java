package com.f1nity.news.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.news.service.NewsService;
import com.f1nity.news.dto.NewsArticle;
import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
public class NewsController {

    @Autowired
    private NewsService newsService;
    
    @GetMapping("/latest")
    public List<NewsArticle> getNews(
            @RequestParam("ticker") String ticker, 
            @RequestParam("from") String fromDate, 
            @RequestParam("to") String toDate,
            @RequestParam("page") int page,
            @RequestParam("pageSize") int pageSize){
        List<NewsArticle> news = newsService.getNews(ticker, fromDate, toDate, page, pageSize);
        return news;
    }
}