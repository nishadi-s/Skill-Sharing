package com.example.app.Services;

import com.example.app.models.ProgressUpdate;
import com.example.app.models.User;
//import com.example.app.repositories.CommentRepository;
//import com.example.app.repositories.LikeRepository;
import com.example.app.repositories.ProgressUpdateRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private CommentRepository commentRepository;
//
//    @Autowired
//    private LikeRepository likeRepository;

    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        progressUpdate.setUserId(user.getId());
        return progressUpdateRepository.save(progressUpdate);
    }

    public List<ProgressUpdate> getAllProgressUpdates() {
        return progressUpdateRepository.findAll();
    }

    public Optional<ProgressUpdate> getProgressUpdateById(String id) {
        return progressUpdateRepository.findById(id);
    }

    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        return progressUpdateRepository.findByUserId(userId);
    }

    public ProgressUpdate updateProgressUpdate(String id, ProgressUpdate updatedProgressUpdate) {
        Optional<ProgressUpdate> existingProgressUpdateOptional = progressUpdateRepository.findById(id);
        if (existingProgressUpdateOptional.isPresent()) {
            ProgressUpdate progressUpdate = existingProgressUpdateOptional.get();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> userOptional = userRepository.findByEmail(email);
            User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

            if (!progressUpdate.getUserId().equals(user.getId())) {
                throw new SecurityException("Unauthorized to update this progress update");
            }

            progressUpdate.setTitle(updatedProgressUpdate.getTitle());
            progressUpdate.setDescription(updatedProgressUpdate.getDescription());
            return progressUpdateRepository.save(progressUpdate);
        }
        throw new RuntimeException("Progress update not found");
    }

    public void deleteProgressUpdate(String id) {
        Optional<ProgressUpdate> progressUpdateOptional = progressUpdateRepository.findById(id);
        if (progressUpdateOptional.isPresent()) {
            ProgressUpdate progressUpdate = progressUpdateOptional.get();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> userOptional = userRepository.findByEmail(email);
            User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

            if (!progressUpdate.getUserId().equals(user.getId())) {
                throw new SecurityException("Unauthorized to delete this progress update");
            }

//            // Delete associated comments and likes
//            commentRepository.deleteByProgressUpdate(progressUpdate);
//            likeRepository.deleteByProgressUpdate(progressUpdate);
            progressUpdateRepository.deleteById(id);
        } else {
            throw new RuntimeException("Progress update not found");
        }
    }
}
