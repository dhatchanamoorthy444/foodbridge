package com.foodbridge.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
public class FoodBridgeApplication {
    public static void main(String[] args) {
        SpringApplication.builder(FoodBridgeApplication.class)
            .properties(
                "spring.jpa.hibernate.ddl-auto=none",
                "spring.jpa.open-in-view=false",
                "spring.jpa.show-sql=false",
                "spring.jpa.properties.hibernate.format_sql=true",
                "spring.jpa.properties.hibernate.use_sql_comments=true"
            )
            .run(args);
    }
}