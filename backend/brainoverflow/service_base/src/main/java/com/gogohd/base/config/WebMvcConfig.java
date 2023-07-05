package com.gogohd.base.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.gogohd.base.interceptor.JwtInterceptor;
import com.gogohd.base.jackson.BlankStringToNullDeserializer;
import com.gogohd.base.jackson.LocalDateTimeSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private JwtInterceptor jwtInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/ucenter/**")
                .excludePathPatterns("/ucenter/login")
                .excludePathPatterns("/ucenter/register")
                .excludePathPatterns("/ucenter/email/**")
                .excludePathPatterns("/ucenter/code")
                .excludePathPatterns("/ucenter/password")
                .addPathPatterns("/edu-course/**")
                .addPathPatterns("/edu-section/**")
                .addPathPatterns("/edu-resource/**")
                .addPathPatterns("/edu-student/**")
                .addPathPatterns("/edu-staff/**")
                .addPathPatterns("/edu-assignment/**")
                .addPathPatterns("/edu-quiz/**")
                .addPathPatterns("/edu-question/**")
                .addPathPatterns("/stream-basic/**")
                .addPathPatterns("/stream-chat/**");
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(mappingJackson2HttpMessageConverter());
    }

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper mapper = new ObjectMapper();

        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new BlankStringToNullDeserializer());
        module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer());
        mapper.registerModule(module);

        converter.setObjectMapper(mapper);

        return converter;
    }
}
