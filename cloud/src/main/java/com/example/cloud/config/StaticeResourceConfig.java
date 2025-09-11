package com.example.cloud.config;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

public class StaticeResourceConfig  implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
       String uploadDir= Paths.get("uploads").toAbsolutePath().toString();
       registry.addResourceHandler("/uploads/**")
               .addResourceLocations("file:" + uploadDir + "/");
                // Cache for 1 hour
    }
}
