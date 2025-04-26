package com.example.app.repositories;

import com.example.app.models.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    // You can add custom queries here if needed
}
