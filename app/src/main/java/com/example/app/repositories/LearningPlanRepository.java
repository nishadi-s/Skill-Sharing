package com.example.app.repositories;

import com.example.app.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByCategory(String category);
    List<LearningPlan> findByProgressBetween(double minProgress, double maxProgress);
    List<LearningPlan> findByCreatorId(String creatorId);
    List<LearningPlan> findByEnrolledUserIdsContaining(String userId);
    List<LearningPlan> findByCreatorIdIn(List<String> creatorIds); // For followed users' plans
}