package com.example.app.controllers;

import com.example.app.models.LearningProgress;
import com.example.app.models.User;
import com.example.app.repositories.LearningProgressRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LearningProgressController {

    @Autowired
    private LearningProgressRepository learningProgressRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new learning progress update
    @PostMapping("/learning-progress")
    public ResponseEntity<?> createLearningProgress(@RequestBody LearningProgress progress) {
        Optional<User> userOptional = userRepository.findById(progress.getUserId());

        if (userOptional.isPresent()) {
            LearningProgress savedProgress = learningProgressRepository.save(progress);
            return ResponseEntity.ok(savedProgress);
        }

        return ResponseEntity.status(404).body("User not found");
    }

    // Get all learning progress updates
    @GetMapping("/learning-progress")
    public ResponseEntity<List<LearningProgress>> getAllLearningProgress() {
        List<LearningProgress> allProgress = learningProgressRepository.findAll();
        return ResponseEntity.ok(allProgress);
    }

    // Get a specific learning progress update by ID
    @GetMapping("/learning-progress/{id}")
    public ResponseEntity<?> getLearningProgress(@PathVariable String id) {
        Optional<LearningProgress> progressOptional = learningProgressRepository.findById(id);

        if (progressOptional.isPresent()) {
            return ResponseEntity.ok(progressOptional.get());
        }

        return ResponseEntity.status(404).body("Learning Progress not found");
    }


}
