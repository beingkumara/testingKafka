package com.f1nity.engine.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("/api/v1")
public class ImageController {

    private final RestTemplate restTemplate = new RestTemplate();

    // Simple in-memory cache for circuit images (24 images * ~50KB = ~1.2MB ram
    // usage, very safe)
    private static final java.util.Map<String, byte[]> IMAGE_CACHE = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.Map<String, org.springframework.http.MediaType> MEDIA_TYPE_CACHE = new java.util.concurrent.ConcurrentHashMap<>();

    @GetMapping("/image-proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            // Basic validation
            if (!url.contains("wikimedia.org") && !url.contains("wikipedia.org")) {
                return ResponseEntity.badRequest().build();
            }

            // check cache first
            if (IMAGE_CACHE.containsKey(url)) {
                MediaType cachedType = MEDIA_TYPE_CACHE.getOrDefault(url, MediaType.IMAGE_JPEG);
                return ResponseEntity.ok()
                        .contentType(cachedType)
                        .header("X-Cache", "HIT")
                        .body(IMAGE_CACHE.get(url));
            }

            // Set headers to fully mimic a browser
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            headers.add("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
            headers.add("Accept-Encoding", "gzip, deflate, br");
            headers.add("Connection", "keep-alive");
            // Some checks might require referer to be wikipedia itself
            headers.add("Referer", "https://en.wikipedia.org/");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    byte[].class);

            MediaType contentType = response.getHeaders().getContentType();

            // Critical fix: If Wikimedia returns HTML (e.g. error page or wiki page),
            // return 400 so frontend onError replaces it
            if (contentType != null && !contentType.toString().startsWith("image")) {
                // Do not cache errors
                return ResponseEntity.badRequest().build();
            }

            if (contentType == null) {
                contentType = MediaType.IMAGE_JPEG;
            }

            // Cache the result
            if (response.getBody() != null) {
                IMAGE_CACHE.put(url, response.getBody());
                MEDIA_TYPE_CACHE.put(url, contentType);
            }

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header("X-Cache", "MISS")
                    .body(response.getBody());
        } catch (HttpClientErrorException e) {
            // 429 handling could go here (e.g. retry after delay), but cache should prevent
            // it eventually
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
