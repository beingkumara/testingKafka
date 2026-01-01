package com.f1nity.engine.impl;

import com.f1nity.library.models.news.NewsArticle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class NewsServiceImplTest {

    @Mock
    private WebClient.Builder webClientBuilder;
    @Mock
    private WebClient webClient;
    @Mock
    private JedisPool jedisPool;
    @Mock
    private Jedis jedis;
    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;
    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private NewsServiceImpl newsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        when(jedisPool.getResource()).thenReturn(jedis);

        // Inject values
        ReflectionTestUtils.setField(newsService, "jedisPool", jedisPool);
        ReflectionTestUtils.setField(newsService, "webClient", webClient);
        ReflectionTestUtils.setField(newsService, "keywords", "F1");
        ReflectionTestUtils.setField(newsService, "exclude", "tennis");
        ReflectionTestUtils.setField(newsService, "apiUrl", "http://api.com");
    }

    @Test
    void testGetNews_CacheHit() {
        String query = "F1";
        String from = "2023-01-01";
        String to = "2023-01-01";
        int page = 1;
        int pageSize = 10;

        when(jedis.exists(anyString())).thenReturn(true);
        when(jedis.get(anyString())).thenReturn("[{}]"); // Mock JSON response

        List<NewsArticle> articles = newsService.getNews(query, from, to, page, pageSize);

        assertNotNull(articles);
        verify(jedis, atLeastOnce()).get(anyString());
    }

    @Test
    void testClearAllNews() {
        newsService.clearAllNews();
        verify(jedis).flushDB();
    }
}
