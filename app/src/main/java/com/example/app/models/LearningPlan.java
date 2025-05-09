package com.example.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String id;
    private String title;
    private String description;
    private List<Topic> topics;
    @DBRef
    private User user;
    private Date createdAt;
    private boolean completed;
    private Date completionDate;

    // Default constructor
    public LearningPlan() {
        this.topics = new ArrayList<>();
        this.createdAt = new Date();
        this.completed = false;
    }

    // Constructor
    public LearningPlan(String title, String description, List<Topic> topics, User user) {
        this.title = title;
        this.description = description;
        this.topics = topics != null ? topics : new ArrayList<>();
        this.user = user;
        this.createdAt = new Date();
        this.completed = false;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed && completionDate == null) {
            this.completionDate = new Date();
        } else if (!completed) {
            this.completionDate = null;
        }
    }

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }

    // Embedded Topic class
    public static class Topic {
        private String id;
        private String title;
        private String description;
        private List<String> resources;
        private boolean completed;
        private Date completionDate;

        // Default constructor
        public Topic() {
            this.id = UUID.randomUUID().toString();
            this.resources = new ArrayList<>();
            this.completed = false;
        }

        // Constructor
        public Topic(String title, String description, List<String> resources) {
            this.id = UUID.randomUUID().toString();
            this.title = title;
            this.description = description;
            this.resources = resources != null ? resources : new ArrayList<>();
            this.completed = false;
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

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getResources() {
            return resources;
        }

        public void setResources(List<String> resources) {
            this.resources = resources;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
            if (completed && completionDate == null) {
                this.completionDate = new Date();
            } else if (!completed) {
                this.completionDate = null;
            }
        }

        public Date getCompletionDate() {
            return completionDate;
        }

        public void setCompletionDate(Date completionDate) {
            this.completionDate = completionDate;
        }
    }
}