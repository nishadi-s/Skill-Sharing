package com.example.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private String category;
    private double progress; // Percentage (0.0 to 100.0)
    private String creatorId; // ID of the user who created the plan
    private List<String> enrolledUserIds; // IDs of users enrolled in the plan
    @Field("topics")
    private List<Topic> topics;

    // Default constructor
    public LearningPlan() {
        this.enrolledUserIds = new ArrayList<>();
        this.topics = new ArrayList<>();
    }

    public LearningPlan(String title, String category, String creatorId) {
        this.title = title;
        this.category = category;
        this.creatorId = creatorId;
        this.progress = 0.0;
        this.enrolledUserIds = new ArrayList<>();
        this.topics = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public List<String> getEnrolledUserIds() {
        return enrolledUserIds;
    }

    public void setEnrolledUserIds(List<String> enrolledUserIds) {
        this.enrolledUserIds = enrolledUserIds;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }
}