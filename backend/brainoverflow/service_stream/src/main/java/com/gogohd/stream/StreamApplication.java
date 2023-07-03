package com.gogohd.stream;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.gogohd")
@MapperScan("com.gogohd.stream.mapper")
@OpenAPIDefinition(
        info = @Info(
                title = "API for Live Stream Service",
                version = "1.0",
                description = "Interfaces for operations related to streaming"
        )
)
@EnableDiscoveryClient
@EnableFeignClients
public class StreamApplication {
    public static void main(String[] args) {
        SpringApplication.run(StreamApplication.class, args);
    }
}
