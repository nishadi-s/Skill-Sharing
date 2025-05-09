package com.example.app.controllers;

import com.example.app.models.ProgressUpdate;
import com.example.app.services.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ResponseEntity<ProgressUpdate> createProgressUpdate(
            @RequestBody ProgressUpdate progressUpdate,
            @RequestParam(value = "learningPlanId", required = false) String learningPlanId) {
        ProgressUpdate createdUpdate = progressUpdateService.createProgressUpdate(progressUpdate, learningPlanId);
        return ResponseEntity.ok(createdUpdate);
    }

    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByUser(
            @RequestParam(value = "userId", required = false) String userId) {
        List<ProgressUpdate> updates;
        if (userId != null) {
            updates = progressUpdateService.getProgressUpdatesByUserId(userId);
        } else {
            updates = progressUpdateService.getProgressUpdatesByUser();
        }
        return ResponseEntity.ok(updates);
    }

    @GetMapping("/learning-plan/{learningPlanId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByLearningPlan(
            @PathVariable String learningPlanId) {
        List<ProgressUpdate> updates = progressUpdateService.getProgressUpdatesByLearningPlanId(learningPlanId);
        return ResponseEntity.ok(updates);
    }

    @GetMapping("/{updateId}")
    public ResponseEntity<ProgressUpdate> getProgressUpdateById(@PathVariable String updateId) {
        ProgressUpdate update = progressUpdateService.getProgressUpdateById(updateId);
        return ResponseEntity.ok(update);
    }

    @PutMapping("/{updateId}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(
            @PathVariable String updateId,
            @RequestBody ProgressUpdate progressUpdate,
            @RequestParam(value = "learningPlanId", required = false) String learningPlanId) {
        ProgressUpdate updatedUpdate = progressUpdateService.updateProgressUpdate(updateId, progressUpdate, learningPlanId);
        return ResponseEntity.ok(updatedUpdate);
    }

    @DeleteMapping("/{updateId}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String updateId) {
        progressUpdateService.deleteProgressUpdate(updateId);
        return ResponseEntity.noContent().build();
    }
}
