package com.f1nity.news.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.f1nity.news.dto.NewsArticle;
import com.f1nity.news.service.NewsService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.net.URISyntaxException;

@JsonIgnoreProperties(ignoreUnknown = true)
class NewsApiResponse {
    private String status;
    private int totalResults;
    private List<NewsArticle> articles;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
    }

    public List<NewsArticle> getArticles() {
        return articles;
    }

    public void setArticles(List<NewsArticle> articles) {
        this.articles = articles;
    }
}

@Service
public class NewsServiceImpl implements NewsService {
    @Value("${news.api}")
    private String apiKey;

    @Value("${news.url}")
    private String apiUrl;

    @Value("${news.domains}")
    private String domains;

    @Value("${news.language}")
    private String language;

    @Value("${news.sortBy}")
    private String sortBy;

    @Value("${news.pageSize}")
    private int pageSize;

    @Value("${news.query.exclude}")
    private String exclude;

    @Value("${news.query.keywords}")
    private String keywords;

    private final WebClient webClient;

    public NewsServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl(apiUrl)
            .build();
    }

    @Override
    public List<NewsArticle> getNewsFromNewsApi(String ticker, int days) {
        try {
            // Build the query string with keywords and exclusions
            String query = String.format("\"%s\" %s -%s", 
                ticker,
                keywords.replace(",", " OR "),  // Convert commas to OR for multiple keywords
                exclude.replaceAll("\\s*,\\s*", " -")  // Convert commas to - for exclusions
            );

            return webClient.get()
                    .uri(uriBuilder -> {
                        UriComponentsBuilder builder = UriComponentsBuilder
                            .fromHttpUrl(apiUrl)
                            .queryParam("q", query)
                            .queryParam("domains", domains)
                            .queryParam("language", language)
                            .queryParam("sortBy", sortBy)
                            .queryParam("pageSize", pageSize)
                            .queryParam("apiKey", apiKey);
                        
                        return builder.build().encode().toUri();
                    })
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(error -> Mono.error(new ResponseStatusException(
                                            clientResponse.statusCode(),
                                            "Error from NewsAPI: " + error)
                                    ))
                    )
                    .bodyToMono(NewsApiResponse.class)
                    .map(NewsApiResponse::getArticles)
                    .block();
        } catch (Exception e) {
            System.err.println("Error fetching news: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
