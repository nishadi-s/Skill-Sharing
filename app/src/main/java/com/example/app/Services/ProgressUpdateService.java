package com.example.app.Services;

import com.example.app.models.LearningPlan;
import com.example.app.models.ProgressUpdate;
import com.example.app.models.User;
import com.example.app.repositories.ProgressUpdateRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningPlanService learningPlanService;

    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate, String learningPlanId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        progressUpdate.setUser(user);
        if (learningPlanId != null) {
            LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
            if (!learningPlan.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to link to this learning plan");
            }
            progressUpdate.setLearningPlan(learningPlan);
        }
        progressUpdate.setCreatedAt(new Date());
        return progressUpdateRepository.save(progressUpdate);
    }

    public List<ProgressUpdate> getProgressUpdatesByUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        return progressUpdateRepository.findByUserId(user.getId());
    }

    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        return progressUpdateRepository.findByUserId(userId);
    }

    public List<ProgressUpdate> getProgressUpdatesByLearningPlanId(String learningPlanId) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        if (!learningPlan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to view updates for this learning plan");
        }
        return progressUpdateRepository.findByLearningPlanId(learningPlanId);
    }

    public ProgressUpdate getProgressUpdateById(String updateId) {
        ProgressUpdate update = progressUpdateRepository.findById(updateId)
                .orElseThrow(() -> new RuntimeException("Progress update not found"));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        if (!update.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to view this progress update");
        }
        return update;
    }

    public ProgressUpdate updateProgressUpdate(String updateId, ProgressUpdate progressUpdate, String learningPlanId) {
        ProgressUpdate existingUpdate = getProgressUpdateById(updateId);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        if (!existingUpdate.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this progress update");
        }
        existingUpdate.setContent(progressUpdate.getContent());
        existingUpdate.setTemplateType(progressUpdate.getTemplateType());
        if (learningPlanId != null) {
            LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
            if (!learningPlan.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to link to this learning plan");
            }
            existingUpdate.setLearningPlan(learningPlan);
        } else {
            existingUpdate.setLearningPlan(null);
        }
        return progressUpdateRepository.save(existingUpdate);
    }

    public void deleteProgressUpdate(String updateId) {
        ProgressUpdate existingUpdate = getProgressUpdateById(updateId);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        if (!existingUpdate.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this progress update");
        }
        progressUpdateRepository.deleteById(updateId);
    }
}
