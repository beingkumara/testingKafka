package com.f1nity.news.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.f1nity.news.dto.NewsArticle;
import com.f1nity.news.service.NewsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import com.f1nity.news.utils.OffsetDateTimeAdapter;

@JsonIgnoreProperties(ignoreUnknown = true)
class NewsApiResponse {
    private String status;
    private int totalResults;
    private List<NewsArticle> articles;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getTotalResults() { return totalResults; }
    public void setTotalResults(int totalResults) { this.totalResults = totalResults; }
    public List<NewsArticle> getArticles() { return articles; }
    public void setArticles(List<NewsArticle> articles) { this.articles = articles; }

    @Override
    public String toString() {
        return "NewsApiResponse [status=" + status + ", totalResults=" + totalResults + ", articles=" + articles + "]";
    }
}

@Service
public class NewsServiceImpl implements NewsService {

    // Add a scheduled method to update the news cache daily
   
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

    @Value("${redis.server}")
    private String redisServer;

    @Value("${redis.port}")
    private int redisPort;

    @Value("${redis.ttl}")
    private int redisTtl;
    
    private WebClient webClient;
    private JedisPool jedisPool;
    private final WebClient.Builder webClientBuilder;
    private final Gson gson;
    private static final String KEY_PREFIX = "f1nity:news:";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public NewsServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
        this.gson = new GsonBuilder()
            .registerTypeAdapter(OffsetDateTime.class, new OffsetDateTimeAdapter())
            .create();
    }
    
    @jakarta.annotation.PostConstruct
    public void init() {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
        this.jedisPool = new JedisPool(redisServer, redisPort);
        System.out.println("Initialized Redis connection to " + redisServer + ":" + redisPort);
    }

    @Scheduled(cron = "0 0 */4 * * *") // every 4 hours, adjust as needed
    public void updateLatestNewsCache() {
        try {
            String defaultTicker = "F1";
            // Today and yesterday
            java.time.LocalDate today = java.time.LocalDate.now(java.time.ZoneId.of("Asia/Kolkata"));
            java.time.LocalDate yesterday = today.minusDays(1);
            String fromDate = yesterday.toString();
            String toDate = today.toString();
            System.out.println("[Scheduler] Updating news cache from " + fromDate + " to " + toDate);
            getNewsFromNewsApi(defaultTicker, fromDate, toDate, 0, pageSize);
        } catch (Exception e) {
            System.err.println("[Scheduler] Error updating news cache: " + e.getMessage());
            e.printStackTrace();
        }
    }
    private String createRedisKey(String date) {
        return KEY_PREFIX + date;
    }

    private boolean checkIfKeyExistsInCache(String date) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.exists(createRedisKey(date));
        }
    }

    private void saveNewsToCache(String fromDate, String toDate, List<NewsArticle> news) {
        try (Jedis jedis = jedisPool.getResource()) {
            for (Date currentDate = parseDate(fromDate); !currentDate.after(parseDate(toDate)); currentDate = DateUtils.addDays(currentDate, 1)) {
                final Date loopDate = new Date(currentDate.getTime()); // Create a final copy for the lambda
                List<NewsArticle> newsForDate = news.stream()
                    .filter(newsArticle -> {
                        // Align publishedAt to system default zone and extract only the date
                        LocalDate articleDate = newsArticle.getPublishedAt()
                            .atZoneSameInstant(ZoneId.systemDefault())
                            .toLocalDate();
                        LocalDate loopLocalDate = loopDate.toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                        return articleDate.equals(loopLocalDate);
                    })
                    .collect(Collectors.toList());
                System.out.println("Saving news to Redis key: " + createRedisKey(DATE_FORMAT.format(loopDate)));
                System.out.println("Saving " + newsForDate.size() + " news articles for date " + DATE_FORMAT.format(loopDate));

                jedis.setex(createRedisKey(DATE_FORMAT.format(loopDate)), redisTtl, gson.toJson(newsForDate));
            }
        }
    }

    private Date parseDate(String date) {
        try {
            return DATE_FORMAT.parse(date);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + date, e);
        }
    }

    public List<NewsArticle> getNewsFromCache(String ticker, String fromDate, String toDate, int page, int pageSize) {
        List<NewsArticle> allNews = new ArrayList<>();
        try (Jedis jedis = jedisPool.getResource()) {
            Date startDate = parseDate(fromDate);
            Date endDate = parseDate(toDate);
            Type listType = new TypeToken<List<NewsArticle>>() {}.getType();

            for (Date currentDate = startDate; !currentDate.after(endDate); currentDate = DateUtils.addDays(currentDate, 1)) {
                String redisKey = createRedisKey(DATE_FORMAT.format(currentDate));
                if (jedis.exists(redisKey)) {
                    String json = jedis.get(redisKey);
                    List<NewsArticle> newsForDate = gson.fromJson(json, listType);
                    if (newsForDate != null) {
                        allNews.addAll(newsForDate);
                    }
                } else {
                    // If any date is missing in cache, fetch from API and cache it
                    return getNewsFromNewsApi(ticker, fromDate, toDate, page, pageSize);
                }
            }
        }

        // Sort the news articles by published date in descending order
        allNews.sort(Comparator.comparing(NewsArticle::getPublishedAt, Comparator.reverseOrder()));

        // Apply pagination
        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, allNews.size());
        if (startIndex >= allNews.size()) {
            return Collections.emptyList();
        }
        List<NewsArticle> pagedNews = allNews.subList(startIndex, endIndex);
        return pagedNews;
    }

    public List<NewsArticle> getNewsFromNewsApi(String ticker, String fromDate, String toDate, int page, int pageSize) {
        try {
            String query = String.format("\"%s\" %s -%s",
                ticker,
                keywords.replace(",", " OR "),
                exclude.replaceAll("\\s*,\\s*", " -")
            );

            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(apiUrl)
                .queryParam("q", query)
                .queryParam("domains", domains)
                .queryParam("language", language)
                .queryParam("sortBy", sortBy)
                .queryParam("from", fromDate)
                .queryParam("to", toDate)
                .queryParam("apiKey", apiKey);

            List<NewsArticle> news = webClient.get()
                .uri(builder.build().toUri())
                .retrieve()
                .onStatus(
                    status -> status.is4xxClientError() || status.is5xxServerError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(error -> Mono.error(new ResponseStatusException(
                            clientResponse.statusCode(),
                            "Error from NewsAPI: " + error))
                        )
                )
                .bodyToMono(NewsApiResponse.class)
                .doOnNext(response -> {
                    if (response.getArticles() != null) {
                        System.out.println("Number of articles: " + response.getArticles().size());
                    } else {
                        System.out.println("No articles in response");
                    }
                })
                .map(NewsApiResponse::getArticles)
                .block();

            if (news != null && !news.isEmpty()) {
                saveNewsToCache(fromDate, toDate, news);
            }
            return news != null ? getNewsFromCache(ticker, fromDate, toDate, page, pageSize) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error in getNewsFromNewsApi: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @Override
    public List<NewsArticle> getNews(String ticker, String fromDate, String toDate, int page, int pageSize) {
        Date startDate = parseDate(fromDate);
        Date endDate = parseDate(toDate);
        boolean allDatesCached = true;

        for (Date currentDate = startDate; !currentDate.after(endDate); currentDate = DateUtils.addDays(currentDate, 1)) {
            if (!checkIfKeyExistsInCache(DATE_FORMAT.format(currentDate))) {
                allDatesCached = false;
                break;
            }
        }

        if (allDatesCached) {
            System.out.println("All dates cached");
            return getNewsFromCache(ticker, fromDate, toDate, page, pageSize);
        } else {
            System.out.println("Not all dates cached. So fetching from API and caching");
            return getNewsFromNewsApi(ticker, fromDate, toDate, page, pageSize);
        }
    }

    @Override
    public void clearCache() {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.flushDB();
        }
    }
}