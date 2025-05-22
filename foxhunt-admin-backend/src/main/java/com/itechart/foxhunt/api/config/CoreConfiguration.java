package com.itechart.foxhunt.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.cache.CacheBuilder;
import com.itechart.foxhunt.api.core.ApiConstants;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.extern.slf4j.Slf4j;
import org.n52.jackson.datatype.jts.JtsModule;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import javax.sql.DataSource;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
@ComponentScan(basePackages = {"com.itechart.foxhunt.api", "com.itechart.foxhunt.domain",
    "com.itechart.foxhunt.email"})
@EntityScan(basePackages = {"com.itechart.foxhunt.api", "com.itechart.foxhunt.domain", "com.itechart.foxhunt.email"})
@Slf4j
public class CoreConfiguration {

    @Value("${postgres.host}")
    private String postgresHost;
    @Value("${postgres.port}")
    private String postgresPort;
    @Value("${postgres.database}")
    private String postgresDatabase;
    @Value("${postgres.user}")
    private String postgresUser;
    @Value("${postgres.password}")
    private String postgresPassword;

    @Bean
    public GroupedOpenApi groupedOpenApi() {
        return GroupedOpenApi.builder()
            .group("foxhunt-admin-service")
            .pathsToMatch(ApiConstants.API_PREFIX + "/**")
            .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .info(new Info().title("FoxHunt Admin Service")
                .description("FoxHunt Admin Service API")
                .version("v0.0.1"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }

    /**
     * Add Content-length and Etag to response
     */

    @Bean
    public FilterRegistrationBean<ShallowEtagHeaderFilter> filterRegistrationBean() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> filterBean = new FilterRegistrationBean<>();
        filterBean.setFilter(new ShallowEtagHeaderFilter());
        filterBean.setUrlPatterns(List.of("*"));
        return filterBean;
    }

    @Bean
    public ObjectMapper mapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JtsModule());
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }

    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(5);
        threadPoolTaskScheduler.initialize();
        return threadPoolTaskScheduler;
    }

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            "organizationFeature",
            "distanceType",
            "globallyDefinedFeatures",
            "activeOrganizationFeature",
            "systemAdminAuthInfo",
            "systemAdminAuthHeader"
        ) {
            @Override
            protected Cache createConcurrentMapCache(String name) {
                return new ConcurrentMapCache(
                    name,
                    CacheBuilder.newBuilder()
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .build().asMap(),
                    false);
            }
        };
    }

    @Bean
    public DataSource dataSource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.driverClassName("org.postgresql.Driver");
        dataSourceBuilder.url("jdbc:postgresql://" + postgresHost + ":" + postgresPort + "/" + postgresDatabase);
        dataSourceBuilder.username(postgresUser);
        dataSourceBuilder.password(postgresPassword);
        return dataSourceBuilder.build();
    }

}
