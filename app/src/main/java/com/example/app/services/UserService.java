package com.example.app.services;

import com.example.app.models.User;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor injection is recommended over field injection
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Find user by OAuth2 provider and providerId
    public Optional<User> findByProviderAndProviderId(String provider, String providerId) {
        return userRepository.findByProviderAndProviderId(provider, providerId);
    }

    // Save or update a user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Find user by ID
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    // Get all users (optional, if needed later)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Delete user by ID (optional, if needed later)
    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }
}
