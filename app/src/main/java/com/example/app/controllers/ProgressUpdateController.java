package com.example.app.controllers;

import com.example.app.models.ProgressUpdate;
import com.example.app.Services.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ResponseEntity<ProgressUpdate> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate createdUpdate = progressUpdateService.createProgressUpdate(progressUpdate);
        return new ResponseEntity<>(createdUpdate, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> getAllProgressUpdates() {
        List<ProgressUpdate> progressUpdates = progressUpdateService.getAllProgressUpdates();
        return ResponseEntity.ok(progressUpdates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdate> getProgressUpdateById(@PathVariable String id) {
        Optional<ProgressUpdate> progressUpdate = progressUpdateService.getProgressUpdateById(id);
        return progressUpdate.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdate> progressUpdates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return ResponseEntity.ok(progressUpdates);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(@PathVariable String id, @RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate updatedProgressUpdate = progressUpdateService.updateProgressUpdate(id, progressUpdate);
        return ResponseEntity.ok(updatedProgressUpdate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        progressUpdateService.deleteProgressUpdate(id);
        return ResponseEntity.noContent().build();
    }
}
