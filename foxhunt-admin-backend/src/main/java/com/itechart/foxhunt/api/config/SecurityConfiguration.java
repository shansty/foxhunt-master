package com.itechart.foxhunt.api.config;

import com.itechart.foxhunt.api.auth.SecurityFilter;
import com.itechart.foxhunt.api.auth.security.UserDetailsServiceImpl;
import com.itechart.foxhunt.api.auth.security.SystemAdminDetailsService;
import com.itechart.foxhunt.api.core.ApiConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration {

    public final String[] publicUrls = new String[]{
        "/webjars/**", "/actuator/**",
        ApiConstants.API_PREFIX + "/admin/api-docs/**",
        ApiConstants.API_PREFIX + "/admin/swagger-ui/**"
    };

    private final String[] getMethodPublicUrls = new String[]{
        ApiConstants.API_PREFIX + "/tooltips",
        "/favicon.ico",
    };

    private final String[] postMethodPublicUrls = new String[]{
        ApiConstants.API_PREFIX + "/login/authentication/**",
        ApiConstants.API_PREFIX + "/login/organization-info",
        ApiConstants.API_PREFIX + "/login/refresh",
        ApiConstants.API_PREFIX + "/users/registration-info",
        ApiConstants.API_PREFIX + "/users/forgot-password",
        ApiConstants.API_PREFIX + "/users/reset-password/**",
        ApiConstants.API_PREFIX + "/users/password",
        ApiConstants.API_PREFIX + "/user-invitations/verify/**",
        ApiConstants.API_PREFIX + "/login/google",
    };

    private final String[] patchMethodPublicUrls = new String[]{"/api/v1/user-invitations/**/decline-reason"};

    private final SecurityFilter securityFilter;

    private final UserDetailsServiceImpl userDetailsService;

    private final SystemAdminDetailsService systemAdminDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // It will delete sessions (and security user in context)
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests(a -> a
                // These urls are used for swagger and actuator. Should be restricted in production
                .antMatchers(HttpMethod.OPTIONS,
                    publicUrls
                ).permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(e -> e
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            ).cors()
            .and()
            .authenticationProvider(commonUserAuthenticationProvider())
            .authenticationProvider(systemAdminAuthenticationProvider())
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
            .csrf().disable();
        return http.build();
    }

    //allow spring security ignore public endpoints
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web
            .ignoring()
            .antMatchers(publicUrls)
            .antMatchers(HttpMethod.GET, getMethodPublicUrls)
            .antMatchers(HttpMethod.POST, postMethodPublicUrls)
            .antMatchers(HttpMethod.PATCH, patchMethodPublicUrls);
    }

    @Bean
    public ProviderManager providerManager() {
        return new ProviderManager(commonUserAuthenticationProvider(), systemAdminAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider systemAdminAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(systemAdminDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(true);
        return authProvider;
    }

    @Bean
    public DaoAuthenticationProvider commonUserAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(true);
        return authProvider;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<SecurityFilter> securityFilterRegistrationBean(SecurityFilter securityFilter) {
        FilterRegistrationBean<SecurityFilter> securityFilterRegistrationBean = new FilterRegistrationBean<>(securityFilter);
        securityFilterRegistrationBean.setEnabled(false);
        return securityFilterRegistrationBean;
    }
}
