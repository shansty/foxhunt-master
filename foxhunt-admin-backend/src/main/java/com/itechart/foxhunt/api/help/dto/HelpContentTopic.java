package com.itechart.foxhunt.api.help.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Map;

@Data
public class HelpContentTopic {

    private Long id;

    @NotNull(message = "(*) The field title is mandatory")
    @Size(max = 50, message = "Title cannot exceed 40 characters")
    private String title;

    private String notes;

    private Map<String, Object> contents;

    @NotNull(message = "isSystem must be set")
    private boolean isSystem;

    @NotNull(message = "(*) The field index is mandatory")
    private Long index;

    private List<HelpContentArticle> articles;
}
