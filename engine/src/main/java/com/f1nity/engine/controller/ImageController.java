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

    @GetMapping("/image-proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            // Basic validation to prevent open proxy abuse (optional but recommended)
            if (!url.contains("wikimedia.org") && !url.contains("wikipedia.org")) {
                return ResponseEntity.badRequest().build();
            }

            ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);

            MediaType contentType = response.getHeaders().getContentType();
            if (contentType == null) {
                contentType = MediaType.IMAGE_JPEG; // default
            }

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(response.getBody());
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
