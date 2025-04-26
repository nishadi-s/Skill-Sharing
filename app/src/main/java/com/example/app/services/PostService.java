package com.example.app.services;

import com.example.app.models.Post;
import com.example.app.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    public Post createPost(Post post) {
        post.setCreatedAt(new Date()); // Set the creation timestamp
        return postRepository.save(post);
    }

    // Get a post by ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get posts by user ID
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    // Update a post
    public Post updatePost(String id, Post post) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post updatedPost = existingPost.get();
            updatedPost.setTitle(post.getTitle());
            updatedPost.setContent(post.getContent());
            updatedPost.setMediaUrls(post.getMediaUrls());
            updatedPost.setFileTypes(post.getFileTypes());
            updatedPost.setTags(post.getTags());
            // Note: Not updating user or createdAt to maintain integrity
            return postRepository.save(updatedPost);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }

    // Delete a post
    public void deletePost(String id) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }
}