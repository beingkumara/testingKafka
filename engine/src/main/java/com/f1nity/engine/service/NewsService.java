package com.f1nity.engine.service;

import com.f1nity.library.models.news.NewsArticle;
import com.f1nity.engine.dto.PagedResponse;

public interface NewsService {
    PagedResponse<NewsArticle> getNews(String ticket, String fromDate, String toDate, int page, int pageSize);

    void clearAllNews();
}
