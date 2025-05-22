package com.itechart.foxhunt.api.config;

import com.itechart.foxhunt.api.auth.security.AuthenticationInfoService;
import feign.RequestInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;

@RequiredArgsConstructor
public class CommonUserFeignClientConfiguration {

    private final AuthenticationInfoService authInfoService;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> requestTemplate.header("payload", authInfoService.getLoggedUserAuthHeader());
    }

}
