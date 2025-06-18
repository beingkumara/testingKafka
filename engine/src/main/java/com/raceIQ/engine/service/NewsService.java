package com.raceIQ.engine.service;

import com.raceIQ.engine.client.NewsApiClient;
import com.raceIQ.engine.model.NewsArticle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
    
import java.util.List;

@Service
public class NewsService {

    private final NewsApiClient newsApiClient;

    @Autowired
    public NewsService(NewsApiClient newsApiClient) {
        this.newsApiClient = newsApiClient;
    }

    public List<NewsArticle> getLatestF1News(String ticket, String fromDate, String toDate, int page, int pageSize) {
        return newsApiClient.getF1News(ticket, fromDate, toDate, page, pageSize);
    }
}
