package com.itechart.foxhunt.api.competition;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.math.BigDecimal;
import java.util.List;

public class FrequencyValidator implements ConstraintValidator<CompetitionFrequency, Double> {
    private static List<Double> allowedFrequencies = List.of(144D, 3.5);
    private double precision;

    @Override
    public void initialize(CompetitionFrequency constraintAnnotation) {
        this.precision = constraintAnnotation.precision();
    }

    @Override
    public boolean isValid(Double frequency, ConstraintValidatorContext constraintValidatorContext) {

        for(Double allowedFrequency: allowedFrequencies){
            if(Math.abs(BigDecimal.valueOf(allowedFrequency).subtract(BigDecimal.valueOf(frequency)).doubleValue()) <= precision){
                return true;
            }
        }

        return false;
    }
}
