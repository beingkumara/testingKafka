package com.f1nity.news.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f1nity.news.service.NewsService;
import com.f1nity.news.dto.NewsArticle;
import java.util.List;

@RestController
public class NewsController {

    @Autowired
    private NewsService newsService;
    
    @GetMapping("/news")
    public List<NewsArticle> getNews(@RequestParam String ticker, @RequestParam int days){
        return newsService.getNewsFromNewsApi(ticker, days);
    }
}