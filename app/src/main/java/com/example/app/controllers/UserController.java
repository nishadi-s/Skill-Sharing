package com.example.app.controllers;

import com.example.app.models.User;
import com.example.app.repositories.UserRepository;
import com.example.app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("email", user.getEmail());
            userDetails.put("name", user.getName());
            userDetails.put("pictureUrl", user.getPictureUrl());
            userDetails.put("followers", user.getFollowers());
            userDetails.put("following", user.getFollowing());

            return ResponseEntity.ok(userDetails);
        }

        return ResponseEntity.status(404).body("User not found");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("email", user.getEmail());
            userDetails.put("name", user.getName());
            userDetails.put("pictureUrl", user.getPictureUrl());
            userDetails.put("followers", user.getFollowers());
            userDetails.put("following", user.getFollowing());

            return ResponseEntity.ok(userDetails);
        }

        return ResponseEntity.status(404).body("User not found");
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> currentUserOptional = userRepository.findByEmail(email);

        if (!currentUserOptional.isPresent()) {
            return ResponseEntity.status(404).body("Current user not found");
        }

        User currentUser = currentUserOptional.get();
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId())) // Exclude current user
                .filter(user -> !currentUser.getFollowers().contains(user.getId())) // Exclude followers
                .filter(user -> !currentUser.getFollowing().contains(user.getId())) // Exclude following
                .map(user -> {
                    Map<String, Object> userDetails = new HashMap<>();
                    userDetails.put("id", user.getId());
                    userDetails.put("email", user.getEmail());
                    userDetails.put("name", user.getName());
                    userDetails.put("pictureUrl", user.getPictureUrl());
                    userDetails.put("followers", user.getFollowers());
                    userDetails.put("following", user.getFollowing());
                    return userDetails;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    @PutMapping("/user/me")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, String> updates) {
        try {
            String name = updates.get("name");
            String pictureUrl = updates.get("pictureUrl");
            User updatedUser = userService.updateUserProfile(name, pictureUrl);
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", updatedUser.getId());
            userDetails.put("email", updatedUser.getEmail());
            userDetails.put("name", updatedUser.getName());
            userDetails.put("pictureUrl", updatedUser.getPictureUrl());
            userDetails.put("followers", updatedUser.getFollowers());
            userDetails.put("following", updatedUser.getFollowing());
            return ResponseEntity.ok(userDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/user/me")
    public ResponseEntity<?> deleteUserAccount() {
        try {
            userService.deleteUserAccount();
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/user/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable String userId) {
        try {
            userService.followUser(userId);
            return ResponseEntity.ok("Successfully followed user");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/user/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId) {
        try {
            userService.unfollowUser(userId);
            return ResponseEntity.ok("Successfully unfollowed user");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping("/public/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok("Service is up and running!");
    }
}