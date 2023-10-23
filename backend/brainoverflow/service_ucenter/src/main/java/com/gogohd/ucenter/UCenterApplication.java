package com.gogohd.ucenter;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.gogohd"})
@MapperScan("com.gogohd.ucenter.mapper")
@OpenAPIDefinition(
        info = @Info(
                title = "API for User Center",
                version = "1.0",
                description = "Interfaces for user operations"
        )
)
@EnableDiscoveryClient
public class UCenterApplication {
    public static void main(String[] args) {
        SpringApplication.run(UCenterApplication.class, args);
    }
}
