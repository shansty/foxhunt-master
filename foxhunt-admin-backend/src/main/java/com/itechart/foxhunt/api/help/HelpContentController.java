package com.itechart.foxhunt.api.help;

import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.feature.CheckFeature;
import com.itechart.foxhunt.api.help.service.HelpContentService;
import com.itechart.foxhunt.api.help.dto.HelpContentArticle;
import com.itechart.foxhunt.api.help.dto.HelpContentTopic;
import com.itechart.foxhunt.domain.enums.FeatureType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = ApiConstants.HELP_CONTENT, produces = MediaType.APPLICATION_JSON_VALUE)
public class HelpContentController {

    private final HelpContentService helpContentService;

    @GetMapping
    public ResponseEntity<List<HelpContentTopic>> getAll() {
        return ResponseEntity.ok(helpContentService.getAll());
    }

    @PatchMapping
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Help content order was updated"),
    })
    @Operation(summary = "Update order", description = "Updates existing help content order")
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    public ResponseEntity<Void> updateOrder(@RequestBody List<HelpContentTopic> helpContentTopics) {
        helpContentService.updateAll(helpContentTopics);
        return ResponseEntity.ok().build();
    }

    @PostMapping(ApiConstants.HELP_CONTENT_TOPIC)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Topic was created"),
    })
    @Operation(summary = "Create topic")
    public ResponseEntity<HelpContentTopic> createTopic(
        @RequestBody HelpContentTopic helpContentTopic) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(helpContentService.createTopic(helpContentTopic));
    }

    @PostMapping(ApiConstants.HELP_CONTENT_ARTICLE_CREATION_BY_TOPIC_ID)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "202", description = "Article was created"),
        @ApiResponse(responseCode = "404", description = "No topic with this id"),
    })
    @Operation(summary = "Create article")
    public ResponseEntity<HelpContentArticle> createArticle(
        @PathVariable(value = "id") Long topicId,
        @RequestBody HelpContentArticle helpContentArticle) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(helpContentService.createArticle(helpContentArticle, topicId));
    }

    @PutMapping(ApiConstants.HELP_CONTENT_TOPIC)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Topic was updated"),
    })
    @Operation(summary = "Update topic")
    public ResponseEntity<HelpContentTopic> updateTopic(
        @RequestBody HelpContentTopic helpContentTopic) {
        return ResponseEntity.ok(helpContentService.updateTopic(helpContentTopic));
    }

    @PutMapping(ApiConstants.HELP_CONTENT_ARTICLE_CREATION_BY_TOPIC_ID)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Article was updated"),
    })
    @Operation(summary = "Update article")
    public ResponseEntity<HelpContentArticle> updateArticle(
        @RequestBody HelpContentArticle helpContentArticle) {
        return ResponseEntity.ok(helpContentService.updateArticle(helpContentArticle));
    }

    @DeleteMapping(ApiConstants.HELP_CONTENT_TOPIC_BY_ID)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Topic was deleted"),
        @ApiResponse(responseCode = "400", description = "No topic with this id"),
    })
    @Operation(summary = "Delete topic")
    public ResponseEntity<Void> removeTopic(@PathVariable(value = "id") Long topicId) {
        helpContentService.removeTopic(topicId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping(ApiConstants.HELP_CONTENT_ARTICLE_BY_ID)
    @CheckFeature(FeatureType.HELP_CONTENT_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Article was deleted"),
        @ApiResponse(responseCode = "404", description = "No article with this id"),
    })
    @Operation(summary = "Delete article")
    public ResponseEntity<Void> removeArticle(@PathVariable(value = "id") Long articleId) {
        helpContentService.removeArticle(articleId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
