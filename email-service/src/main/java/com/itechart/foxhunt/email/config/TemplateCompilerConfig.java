package com.itechart.foxhunt.email.config;

import com.itechart.foxhunt.email.servcie.TemplateCompiler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TemplateCompilerConfig {

  @Bean
  public TemplateCompiler getTemplateCompiler() {
    return new TemplateCompiler();
  }

}