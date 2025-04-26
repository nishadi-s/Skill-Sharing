package com.example.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learning_progress")
public class LearningProgress {

    @Id
    private String id;

    private String userId;  // Reference to the User who is posting the update
    private String topic;   // Topic of the learning progress
    private String description;  // Description of the progress
    private String progressStatus;  // Example: "In Progress", "Completed", etc.
    private String datePosted;  // Date when the update was posted

    // Default constructor
    public LearningProgress() {}

    // Constructor with parameters
    public LearningProgress(String userId, String topic, String description, String progressStatus, String datePosted) {
        this.userId = userId;
        this.topic = topic;
        this.description = description;
        this.progressStatus = progressStatus;
        this.datePosted = datePosted;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProgressStatus() {
        return progressStatus;
    }

    public void setProgressStatus(String progressStatus) {
        this.progressStatus = progressStatus;
    }

    public String getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(String datePosted) {
        this.datePosted = datePosted;
    }
}
