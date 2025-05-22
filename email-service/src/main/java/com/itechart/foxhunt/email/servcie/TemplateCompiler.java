package com.itechart.foxhunt.email.servcie;

import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.stringtemplate.v4.ST;

import java.io.IOException;
import java.util.Map;

@Component
public class TemplateCompiler {

    public String compileMessageTemplate(Map<String, Object> map, String message) throws IOException, TemplateException {
        StringTemplateLoader stringLoader = new StringTemplateLoader();
        stringLoader.putTemplate("template", message);
        Configuration freemarkerConfig = new Configuration();
        freemarkerConfig.setTemplateLoader(stringLoader);
        Template template = freemarkerConfig.getTemplate("template");
        return FreeMarkerTemplateUtils.processTemplateIntoString(template, map);
    }

    public String compileSubjectTemplate(Map<String, Object> map, String message) {
        ST query = new ST(message);
        map.forEach(query::add);
        return query.toString();
    }

}
