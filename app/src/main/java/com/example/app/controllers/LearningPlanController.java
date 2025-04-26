package com.example.app.controllers;

import com.example.app.models.LearningPlan;
import com.example.app.models.Topic;
import com.example.app.models.User;
import com.example.app.repositories.LearningPlanRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper method to get current user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElseThrow(() -> new RuntimeException("User not found"));
    }

    // POST: Create a new learning plan
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        User currentUser = getCurrentUser();
        learningPlan.setCreatorId(currentUser.getId());
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);
        return ResponseEntity.ok(savedPlan);
    }

    // POST: Enroll in a learning plan
    @PostMapping("/{planId}/enroll")
    public ResponseEntity<?> enrollInPlan(@PathVariable String planId) {
        User currentUser = getCurrentUser();
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOptional.get();
        if (!plan.getEnrolledUserIds().contains(currentUser.getId())) {
            plan.getEnrolledUserIds().add(currentUser.getId());
            learningPlanRepository.save(plan);

            currentUser.getEnrolledPlans().add(planId);
            userRepository.save(currentUser);
        }
        return ResponseEntity.ok("Enrolled successfully");
    }

    // GET: Retrieve plans by category
    @GetMapping("/category/{category}")
    public List<LearningPlan> getPlansByCategory(@PathVariable String category) {
        return learningPlanRepository.findByCategory(category);
    }

    // GET: Retrieve plans by progress level
    @GetMapping("/progress")
    public List<LearningPlan> getPlansByProgress(
            @RequestParam double minProgress,
            @RequestParam double maxProgress) {
        return learningPlanRepository.findByProgressBetween(minProgress, maxProgress);
    }

    // GET: Retrieve plans the user is enrolled in
    @GetMapping("/my-plans")
    public List<LearningPlan> getMyPlans() {
        User currentUser = getCurrentUser();
        return learningPlanRepository.findByEnrolledUserIdsContaining(currentUser.getId());
    }

    // PUT: Update a learning plan (e.g., add topics, update title/category)
    @PutMapping("/{planId}")
    public ResponseEntity<?> updateLearningPlan(@PathVariable String planId, @RequestBody LearningPlan updatedPlan) {
        User currentUser = getCurrentUser();
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOptional.get();
        if (!plan.getCreatorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Only the creator can update the plan");
        }

        plan.setTitle(updatedPlan.getTitle());
        plan.setCategory(updatedPlan.getCategory());
        plan.setTopics(updatedPlan.getTopics());
        learningPlanRepository.save(plan);
        return ResponseEntity.ok(plan);
    }

    // PUT: Update progress by marking a topic as completed
    @PutMapping("/{planId}/topics/{topicIndex}/complete")
    public ResponseEntity<?> markTopicAsCompleted(@PathVariable String planId, @PathVariable int topicIndex) {
        User currentUser = getCurrentUser();
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOptional.get();
        if (!plan.getEnrolledUserIds().contains(currentUser.getId())) {
            return ResponseEntity.status(403).body("User not enrolled in this plan");
        }

        List<Topic> topics = plan.getTopics();
        if (topicIndex < 0 || topicIndex >= topics.size()) {
            return ResponseEntity.status(400).body("Invalid topic index");
        }

        Topic topic = topics.get(topicIndex);
        topic.setCompleted(true);

        // Calculate progress: percentage of completed topics
        long completedTopics = topics.stream().filter(Topic::isCompleted).count();
        plan.setProgress((completedTopics * 100.0) / topics.size());

        learningPlanRepository.save(plan);
        return ResponseEntity.ok(plan);
    }

    // DELETE: Remove a learning plan (only by creator)
    @DeleteMapping("/{planId}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String planId) {
        User currentUser = getCurrentUser();
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOptional.get();
        if (!plan.getCreatorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Only the creator can delete the plan");
        }

        learningPlanRepository.delete(plan);
        return ResponseEntity.ok("Learning plan deleted");
    }

    // POST: Unenroll from a learning plan
    @PostMapping("/{planId}/unenroll")
    public ResponseEntity<?> unenrollFromPlan(@PathVariable String planId) {
        User currentUser = getCurrentUser();
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOptional.get();
        plan.getEnrolledUserIds().remove(currentUser.getId());
        learningPlanRepository.save(plan);

        currentUser.getEnrolledPlans().remove(planId);
        userRepository.save(currentUser);
        return ResponseEntity.ok("Unenrolled successfully");
    }
}