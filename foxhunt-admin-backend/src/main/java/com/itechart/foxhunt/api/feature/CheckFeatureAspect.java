package com.itechart.foxhunt.api.feature;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.feature.service.FeatureService;
import com.itechart.foxhunt.domain.enums.FeatureType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.List;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class CheckFeatureAspect {

    private final FeatureService featureService;
    private final LoggedUserService loggedUserService;

    @Pointcut("within(@CheckFeature *) && execution(* *(..))")
    private void annotatedClassMethods() {
    }

    @Pointcut("@annotation(CheckFeature)")
    private void annotatedMethods() {
    }

    @Around("annotatedClassMethods() || annotatedMethods()")
    public Object isFeatureActiveForOrg(ProceedingJoinPoint joinPoint) throws Throwable {
        Long organizationId = loggedUserService.getLoggedUserOrganizationId();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        FeatureType featureType = getAnnotationValue(method);

        log.debug("Checking availability of feature {} in organization {}", featureType.name(), organizationId);

        if (!featureService.hasFeaturesEnabled(organizationId, List.of(featureType))) {
            log.warn("Feature {} is not available in organization {}", featureType.name(), organizationId);
            throw new UnsupportedOperationException(featureType.name() + " operations are unsupported");
        } else {
            log.warn("Feature {} is available in organization {}", featureType.name(), organizationId);
        }
        return joinPoint.proceed();
    }

    private FeatureType getAnnotationValue(Method method) {
        if (isMethodAnnotated(method)) {
            FeatureType feature = method.getAnnotation(CheckFeature.class).value();
            log.debug("Feature type {} was gotten from annotated method {}", feature, method.getName());
            return feature;
        } else {
            Class<?> methodDeclaringClass = method.getDeclaringClass();
            FeatureType feature = methodDeclaringClass.getAnnotation(CheckFeature.class).value();
            log.debug("Feature type {} was gotten from annotated class {}", feature, methodDeclaringClass.getName());
            return feature;
        }
    }

    private boolean isMethodAnnotated(Method method) {
        return method.getAnnotation(CheckFeature.class) != null;
    }
}
