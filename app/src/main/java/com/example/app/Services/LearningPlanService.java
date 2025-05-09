package com.example.app.services;

import com.example.app.models.LearningPlan;
import com.example.app.models.User;
import com.example.app.repositories.LearningPlanRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        learningPlan.setUser(user);
        learningPlan.setCreatedAt(new Date());
        if (learningPlan.getTopics() == null) {
            learningPlan.setTopics(new java.util.ArrayList<>());
        } else {
            for (LearningPlan.Topic topic : learningPlan.getTopics()) {
                if (topic.getTitle() == null || topic.getTitle().trim().isEmpty()) {
                    throw new IllegalArgumentException("Topic title is required");
                }
                if (topic.getId() == null) {
                    topic.setId(UUID.randomUUID().toString());
                }
                if (topic.getResources() == null) {
                    topic.setResources(new java.util.ArrayList<>());
                }
            }
        }
        return learningPlanRepository.save(learningPlan);
    }

    public List<LearningPlan> getLearningPlansByUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        return learningPlanRepository.findByUserId(user.getId());
    }

    public LearningPlan getLearningPlanById(String planId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        if (!plan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this learning plan");
        }
        return plan;
    }

    public LearningPlan updateLearningPlan(String planId, LearningPlan learningPlan) {
        LearningPlan existingPlan = getLearningPlanById(planId); // Includes authorization check
        existingPlan.setTitle(learningPlan.getTitle());
        existingPlan.setDescription(learningPlan.getDescription());
        existingPlan.setTopics(learningPlan.getTopics());
        existingPlan.setCompleted(learningPlan.isCompleted());
        return learningPlanRepository.save(existingPlan);
    }

    public void deleteLearningPlan(String planId) {
        LearningPlan existingPlan = getLearningPlanById(planId); // Includes authorization check
        learningPlanRepository.deleteById(planId);
    }

    public LearningPlan addTopic(String planId, LearningPlan.Topic topic) {
        LearningPlan plan = getLearningPlanById(planId); // Includes authorization check
        topic.setId(UUID.randomUUID().toString());
        plan.getTopics().add(topic);
        return learningPlanRepository.save(plan);
    }

    public LearningPlan updateTopic(String planId, String topicId, LearningPlan.Topic updatedTopic) {
        LearningPlan plan = getLearningPlanById(planId); // Includes authorization check
        LearningPlan.Topic topic = plan.getTopics().stream()
                .filter(t -> t.getId() != null && t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        topic.setTitle(updatedTopic.getTitle());
        topic.setDescription(updatedTopic.getDescription());
        topic.setResources(updatedTopic.getResources());
        topic.setCompleted(updatedTopic.isCompleted());
        return learningPlanRepository.save(plan);
    }

    public LearningPlan deleteTopic(String planId, String topicId) {
        LearningPlan plan = getLearningPlanById(planId); // Includes authorization check
        boolean removed = plan.getTopics().removeIf(t -> t.getId() != null && t.getId().equals(topicId));
        if (!removed) {
            throw new RuntimeException("Topic not found");
        }
        // Update plan's completed status
        boolean allTopicsCompleted = plan.getTopics().isEmpty() ||
                plan.getTopics().stream().allMatch(LearningPlan.Topic::isCompleted);
        plan.setCompleted(allTopicsCompleted);
        return learningPlanRepository.save(plan);
    }

    public LearningPlan markTopicCompleted(String planId, String topicId, boolean completed) {
        LearningPlan plan = getLearningPlanById(planId); // Includes authorization check
        LearningPlan.Topic topic = plan.getTopics().stream()
                .filter(t -> t.getId() != null && t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        topic.setCompleted(completed);
        // Update plan's completed status
        boolean allTopicsCompleted = plan.getTopics().isEmpty() ||
                plan.getTopics().stream().allMatch(LearningPlan.Topic::isCompleted);
        plan.setCompleted(allTopicsCompleted);
        return learningPlanRepository.save(plan);
    }
}
