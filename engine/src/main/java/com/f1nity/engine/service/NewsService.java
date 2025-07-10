package com.f1nity.engine.service;

import com.f1nity.library.models.news.NewsArticle;
import org.springframework.stereotype.Service;
    
import java.util.List;

public interface NewsService {
    List<NewsArticle> getNews(String ticket, String fromDate, String toDate, int page, int pageSize);
    void clearAllNews();
}
    