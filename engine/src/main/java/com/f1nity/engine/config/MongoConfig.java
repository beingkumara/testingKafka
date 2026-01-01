package com.f1nity.engine.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${auth.mongodb.uri}")
    private String authMongoUri;

    // Default MongoDB configuration
    @Primary
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    @Primary
    @Bean
    public MongoDatabaseFactory mongoDbFactory(MongoClient mongoClient) {
        // The database name is parsed from the URI, but we can allow
        // SimpleMongoClientDatabaseFactory to handle it
        return new SimpleMongoClientDatabaseFactory(mongoUri);
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
        return new SimpleMongoClientDatabaseFactory(authMongoUri);
    }
}