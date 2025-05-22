package com.itechart.foxhunt.api.config;

import com.itechart.foxhunt.api.auth.security.AuthenticationInfoService;
import com.itechart.foxhunt.api.core.OrganizationId;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

//TODO Find a better place for that class
@RequiredArgsConstructor
@Component
public class OrganizationArgumentResolver implements HandlerMethodArgumentResolver {

    private final AuthenticationInfoService authInfoService;

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.getParameterType().equals(OrganizationId.class);
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) {
        Long organizationId = authInfoService.getLoggedUserAuthenticationInfo().getOrganizationId();
        return new OrganizationId(organizationId);
    }
}
