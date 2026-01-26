package com.f1nity.engine.impl;

import com.f1nity.engine.service.NewsService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.f1nity.library.models.news.NewsArticle;
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
import org.springframework.web.util.UriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Type;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import com.f1nity.engine.utils.OffsetDateTimeAdapter;

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

    @Value("${redis.url}")
    private String redisUrl;

    @Value("${redis.ttl}")
    private int redisTtl;

    private WebClient webClient;
    private JedisPool jedisPool;
    private final WebClient.Builder webClientBuilder;
    private final Gson gson;
    private static final String KEY_PREFIX = "f1nity:news:";
    private static final java.time.format.DateTimeFormatter DATE_FORMAT = java.time.format.DateTimeFormatter.ISO_LOCAL_DATE;
    private static final Logger logger = LoggerFactory.getLogger(NewsServiceImpl.class);

    public NewsServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
        this.gson = new GsonBuilder()
                .registerTypeAdapter(OffsetDateTime.class, new OffsetDateTimeAdapter())
                .create();
    }

    @Value("${redis.password:}")
    private String redisPassword;

    @jakarta.annotation.PostConstruct
    public void init() {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
        try {
            String formattedUrl = redisUrl;
            if (!formattedUrl.startsWith("redis://") && !formattedUrl.startsWith("rediss://")) {
                formattedUrl = "redis://" + formattedUrl;
            }
            java.net.URI uri = java.net.URI.create(formattedUrl);

            String password = redisPassword;
            if (password == null || password.isEmpty()) {
                // Try to get from URI if not in env prop
                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":");
                    if (parts.length > 1)
                        password = parts[1];
                    else if (parts.length == 1)
                        password = parts[0];
                }
            }

            if (password != null && !password.isEmpty()) {
                this.jedisPool = new JedisPool(new redis.clients.jedis.JedisPoolConfig(), uri.getHost(), uri.getPort(),
                        2000, password);
            } else {
                this.jedisPool = new JedisPool(uri);
            }

            logger.info("Initialized Redis connection to {}", uri.getHost());
        } catch (Exception e) {
            logger.error("Failed to initialize Redis connection: {}", e.getMessage(), e);
        }
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
            logger.info("[Scheduler] Updating news cache from {} to {}", fromDate, toDate);
            getNewsFromNewsApi(defaultTicker, fromDate, toDate, 0, pageSize);
        } catch (Exception e) {
            logger.error("[Scheduler] Error updating news cache: {}", e.getMessage(), e);
        }
    }

    private String createRedisKey(LocalDate date) {
        return KEY_PREFIX + date.format(DATE_FORMAT);
    }

    private boolean checkIfKeyExistsInCache(LocalDate date) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.exists(createRedisKey(date));
        }
    }

    private void saveNewsToCache(LocalDate fromDate, LocalDate toDate, List<NewsArticle> news) {
        try (Jedis jedis = jedisPool.getResource()) {
            for (LocalDate currentDate = fromDate; !currentDate.isAfter(toDate); currentDate = currentDate
                    .plusDays(1)) {
                final LocalDate loopDate = currentDate;
                List<NewsArticle> newsForDate = news.stream()
                        .filter(newsArticle -> {
                            // Align publishedAt to system default zone and extract only the date
                            LocalDate articleDate = newsArticle.getPublishedAt()
                                    .atZoneSameInstant(ZoneId.systemDefault())
                                    .toLocalDate();
                            return articleDate.equals(loopDate);
                        })
                        .collect(Collectors.toList());
                logger.info("Saving news to Redis key: {}", createRedisKey(loopDate));
                logger.info("Saving {} news articles for date {}", newsForDate.size(), loopDate);

                jedis.setex(createRedisKey(loopDate), redisTtl, gson.toJson(newsForDate));
            }
        }
    }

    private LocalDate parseDate(String date) {
        try {
            return LocalDate.parse(date, DATE_FORMAT);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + date, e);
        }
    }

    public List<NewsArticle> getNewsFromCache(String ticker, String fromDate, String toDate, int page, int pageSize) {
        List<NewsArticle> allNews = new ArrayList<>();
        try (Jedis jedis = jedisPool.getResource()) {
            LocalDate startDate = parseDate(fromDate);
            LocalDate endDate = parseDate(toDate);
            Type listType = new TypeToken<List<NewsArticle>>() {
            }.getType();

            for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate
                    .plusDays(1)) {
                String redisKey = createRedisKey(currentDate);
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
                    exclude.replaceAll("\\s*,\\s*", " -"));

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
                                            "Error from NewsAPI: " + error))))
                    .bodyToMono(NewsApiResponse.class)
                    .doOnNext(response -> {
                        if (response.getArticles() != null) {
                            logger.info("Number of articles: {}", response.getArticles().size());
                        } else {
                            logger.info("No articles in response");
                        }
                    })
                    .map(NewsApiResponse::getArticles)
                    .block();

            if (news != null && !news.isEmpty()) {
                saveNewsToCache(parseDate(fromDate), parseDate(toDate), news);
            }

            // Break recursion: return processed list directly
            List<NewsArticle> result = news != null ? news : new ArrayList<>();
            result.sort(Comparator.comparing(NewsArticle::getPublishedAt, Comparator.reverseOrder()));

            int startIndex = (page - 1) * pageSize;
            int endIndex = Math.min(startIndex + pageSize, result.size());
            if (startIndex >= result.size()) {
                return Collections.emptyList();
            }
            return result.subList(startIndex, endIndex);

        } catch (Exception e) {
            logger.error("Error in getNewsFromNewsApi: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<NewsArticle> getNews(String ticker, String fromDate, String toDate, int page, int pageSize) {
        LocalDate startDate = parseDate(fromDate);
        LocalDate endDate = parseDate(toDate);
        boolean allDatesCached = true;

        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {
            if (!checkIfKeyExistsInCache(currentDate)) {
                allDatesCached = false;
                break;
            }
        }

        if (allDatesCached) {
            logger.info("All dates cached");
            return getNewsFromCache(ticker, fromDate, toDate, page, pageSize);
        } else {
            logger.info("Not all dates cached. So fetching from API and caching");
            return getNewsFromNewsApi(ticker, fromDate, toDate, page, pageSize);
        }
    }

    @Override
    public void clearAllNews() {
        clearCache();
    }

    public void clearCache() {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.flushDB();
        }
    }
}