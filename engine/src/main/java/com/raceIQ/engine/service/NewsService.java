package com.raceIQ.engine.service;

import com.raceIQ.engine.client.NewsApiClient;
import com.f1nity.library.models.news.NewsArticle;
import org.springframework.stereotype.Service;
    
import java.util.List;

@Service
public class NewsService {

    private final NewsApiClient newsApiClient;

    public NewsService(NewsApiClient newsApiClient) {
        this.newsApiClient = newsApiClient;
    }

    public List<NewsArticle> getLatestF1News(String ticket, String fromDate, String toDate, int page, int pageSize) {
        return newsApiClient.getF1News(ticket, fromDate, toDate, page, pageSize);
    }
}
