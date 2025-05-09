package com.example.app.controllers;

import com.example.app.models.LearningPlan;
import com.example.app.Services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        if (learningPlan.getTitle() == null || learningPlan.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Learning plan title is required");
        }
        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return ResponseEntity.ok(createdPlan);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getLearningPlansByUser() {
        List<LearningPlan> plans = learningPlanService.getLearningPlansByUser();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{planId}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String planId) {
        LearningPlan plan = learningPlanService.getLearningPlanById(planId);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String planId,
            @RequestBody LearningPlan learningPlan) {
        if (learningPlan.getTitle() == null || learningPlan.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Learning plan title is required");
        }
        LearningPlan updatedPlan = learningPlanService.updateLearningPlan(planId, learningPlan);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String planId) {
        learningPlanService.deleteLearningPlan(planId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{planId}/topics")
    public ResponseEntity<LearningPlan> addTopic(
            @PathVariable String planId,
            @RequestBody LearningPlan.Topic topic) {
        if (topic.getTitle() == null || topic.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Topic title is required");
        }
        LearningPlan updatedPlan = learningPlanService.addTopic(planId, topic);
        return ResponseEntity.ok(updatedPlan);
    }

    @PutMapping("/{planId}/topics/{topicId}")
    public ResponseEntity<LearningPlan> updateTopic(
            @PathVariable String planId,
            @PathVariable String topicId,
            @RequestBody LearningPlan.Topic topic) {
        if (topic.getTitle() == null || topic.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Topic title is required");
        }
        LearningPlan updatedPlan = learningPlanService.updateTopic(planId, topicId, topic);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{planId}/topics/{topicId}")
    public ResponseEntity<LearningPlan> deleteTopic(
            @PathVariable String planId,
            @PathVariable String topicId) {
        LearningPlan updatedPlan = learningPlanService.deleteTopic(planId, topicId);
        return ResponseEntity.ok(updatedPlan);
    }

    @PatchMapping("/{planId}/topics/{topicId}/complete")
    public ResponseEntity<LearningPlan> markTopicCompleted(
            @PathVariable String planId,
            @PathVariable String topicId,
            @RequestBody boolean completed) {
        LearningPlan updatedPlan = learningPlanService.markTopicCompleted(planId, topicId, completed);
        return ResponseEntity.ok(updatedPlan);
    }
}
