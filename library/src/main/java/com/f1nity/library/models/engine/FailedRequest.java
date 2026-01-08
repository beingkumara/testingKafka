package com.f1nity.library.models.engine;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "failed_requests")
public class FailedRequest {
    @Id
    private String id;
    private int year;
    private String round;
    private String type; // "race", "sprint", "qualifying", "standings"
    private String error;
    private long timestamp;
    private boolean processed;

    public FailedRequest() {
    }

    public FailedRequest(int year, String round, String type, String error) {
        this.year = year;
        this.round = round;
        this.type = type;
        this.error = error;
        this.timestamp = System.currentTimeMillis();
        this.processed = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getRound() {
        return round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isProcessed() {
        return processed;
    }

    public void setProcessed(boolean processed) {
        this.processed = processed;
    }
}
