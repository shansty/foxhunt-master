package com.itechart.foxhunt.email.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.mail.Multipart;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailDto {

    private List<String> toList = List.of();

    private List<String> bccList = List.of();

    private List<String> ccList = List.of();

    private String subject;

    private String text;

    private Map<String, Object> textTemplateValuesMap = Map.of();

    private Map<String, Object> subjectTemplateValuesMap = Map.of();

    private List<Multipart> attachmentList = List.of();

}