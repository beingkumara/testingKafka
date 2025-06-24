package com.f1nity.engine.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    // Default MongoDB configuration
    @Primary
    @Bean
    public MongoClient mongoClient() {
        // Replace with your MongoDB connection string
        String connectionString = "mongodb://localhost:27017/f1nity";
        return MongoClients.create(connectionString);
    }

    @Primary
    @Bean
    public MongoDatabaseFactory mongoDbFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(mongoClient, "f1nity");
    }

    @Primary
    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDbFactory) {
        return new MongoTemplate(mongoDbFactory);
    }

    // Auth MongoDB configuration
    @Bean(name = "authMongoTemplate")
    public MongoTemplate authMongoTemplate() {
        return new MongoTemplate(authMongoDbFactory());
    }

    @Bean
    public MongoDatabaseFactory authMongoDbFactory() {
        // Replace with your auth MongoDB connection string
        String authConnectionString = "mongodb://localhost:27017/authentication";
        return new SimpleMongoClientDatabaseFactory(authConnectionString);
    }
}