package com.itechart.foxhunt.api.competition;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({METHOD, FIELD, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = FrequencyValidator.class)
@Documented
public @interface CompetitionFrequency {
    String message() default "Invalid frequency";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    double precision() default 0;
}
