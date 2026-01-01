package com.f1nity.engine.controller;

import com.f1nity.engine.service.NewsService;
import com.f1nity.library.models.news.NewsArticle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NewsControllerTest {

    @Mock
    private NewsService newsService;

    @InjectMocks
    private NewsController newsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetLatestF1News_WithParams() {
        String ticket = "F1";
        String from = "2023-01-01";
        String to = "2023-01-31";
        int page = 1;
        int pageSize = 10;

        when(newsService.getNews(ticket, from, to, page, pageSize)).thenReturn(Arrays.asList(new NewsArticle()));

        List<NewsArticle> articles = newsController.getLatestF1News(ticket, from, to, page, pageSize);

        assertNotNull(articles);
        assertEquals(1, articles.size());
        verify(newsService).getNews(ticket, from, to, page, pageSize);
    }

    @Test
    void testGetLatestF1News_DefaultParams() {
        // Defaults: query="F1", page=0, pageSize=0 (primitive int default)
        // Check implementation default logic

        when(newsService.getNews(anyString(), anyString(), anyString(), anyInt(), anyInt()))
                .thenReturn(Collections.emptyList());

        newsController.getLatestF1News(null, null, null, 0, 0);

        verify(newsService).getNews(eq("F1"), anyString(), anyString(), eq(0), eq(0));
    }

    @Test
    void testClearAllNews() {
        String response = newsController.clearAllNews();
        assertEquals("All news cleared", response);
        verify(newsService).clearAllNews();
    }
}
