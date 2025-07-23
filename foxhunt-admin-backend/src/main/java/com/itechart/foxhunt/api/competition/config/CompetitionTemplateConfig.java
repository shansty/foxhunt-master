package com.itechart.foxhunt.api.competition.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.List;

@Component
@Getter
@Setter
public class CompetitionTemplateConfig {
    private static final String TEMPLATE_CONFIG_PATH = "competition-template/template.yml";
    private List<CompetitionTemplate> templates;

    @PostConstruct
    @SneakyThrows
    private void init() {
        ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
        InputStream config = new ClassPathResource(TEMPLATE_CONFIG_PATH).getInputStream();
        templates = objectMapper.readValue(config, CompetitionTemplateConfig.class).getTemplates();
    }

    @Data
    public static class CompetitionTemplate {
        private Long templateId;
        private String name;
        private String notes;
        private String locationName;
        private Boolean isPrivate;
        private Byte foxAmount;
        private String distanceTypeName;
        private Integer foxDuration;
        private Integer foxRange;
        private Boolean foxoringEnabled;
        private Boolean hasSilenceInterval;
        private Double frequency;
        private List<String> participantEmails;
    }
}
