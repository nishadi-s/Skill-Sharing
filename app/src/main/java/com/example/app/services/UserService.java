package com.example.app.services;

import com.auth.app.model.User;
import com.auth.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(String name, String pictureUrl) {
        User currentUser = getCurrentUser();
        if (name != null && !name.trim().isEmpty()) {
            currentUser.setName(name);
        }
        if (pictureUrl != null && !pictureUrl.trim().isEmpty()) {
            currentUser.setPictureUrl(pictureUrl);
        }
        return userRepository.save(currentUser);
    }

    public void deleteUserAccount() {
        User currentUser = getCurrentUser();
        userRepository.deleteById(currentUser.getId());
        SecurityContextHolder.clearContext(); // Clear authentication context
    }

    public void followUser(String userIdToFollow) {
        User currentUser = getCurrentUser();
        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (currentUser.getId().equals(userIdToFollow)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        if (!currentUser.getFollowing().contains(userIdToFollow)) {
            currentUser.getFollowing().add(userIdToFollow);
            userToFollow.getFollowers().add(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(userToFollow);
        }
    }

    public void unfollowUser(String userIdToUnfollow) {
        User currentUser = getCurrentUser();
        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        if (currentUser.getFollowing().contains(userIdToUnfollow)) {
            currentUser.getFollowing().remove(userIdToUnfollow);
            userToUnfollow.getFollowers().remove(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(userToUnfollow);
        }
    }
}