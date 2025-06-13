package com.raceIQ.engine.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsResponse {
    private String status;
    private int totalResults;
    private List<NewsArticle> articles;
}
