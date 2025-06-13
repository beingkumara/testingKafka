package com.f1nity.news.service;

import com.f1nity.news.dto.NewsArticle;
import java.util.List;

public interface NewsService {
    List<NewsArticle> getNewsFromNewsApi(String ticker, int days);
}