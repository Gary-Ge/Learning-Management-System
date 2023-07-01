package com.gogohd.forum;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.gogohd")
@MapperScan("com.gogohd.forum.mapper")
@OpenAPIDefinition(
        info = @Info(
                title = "API for Forum",
                version = "1.0",
                description = "Interfaces for forum operation"
        )
)
@EnableDiscoveryClient
public class ForumApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForumApplication.class, args);
    }
}
