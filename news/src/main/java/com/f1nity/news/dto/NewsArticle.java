package com.f1nity.news.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.OffsetDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsArticle {
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private OffsetDateTime publishedAt;
    private String content;
    private Source source;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getUrlToImage() { return urlToImage; }
    public void setUrlToImage(String urlToImage) { this.urlToImage = urlToImage; }
    
    public OffsetDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(OffsetDateTime publishedAt) { this.publishedAt = publishedAt; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Source getSource() { return source; }
    public void setSource(Source source) { this.source = source; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Source {
        private String id;
        private String name;
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    @Override
    public String toString() {
        return "NewsArticle [title=" + title + ", description=" + description + ", url=" + url + ", urlToImage=" + urlToImage + ", publishedAt=" + publishedAt + ", content=" + content + ", source=" + source + "]";
    }
}
