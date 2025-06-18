package com.raceIQ.engine.client;

import com.raceIQ.engine.config.FeignConfig;
import com.raceIQ.engine.model.NewsArticle;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
    
@FeignClient(
    name = "newsApiClient",
    url = "${news.service.url}",  // Will be configured in application.properties
    configuration = FeignConfig.class
)
public interface NewsApiClient {
    
    @GetMapping("/latest")
    List<NewsArticle> getF1News(
        @RequestParam("ticker") String ticker, 
        @RequestParam("from") String fromDate, 
        @RequestParam("to") String toDate,
        @RequestParam("page") int page,
        @RequestParam("pageSize") int pageSize
    );
}
