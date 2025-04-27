package com.example.app.services;

import com.example.app.models.Post;
import java.util.List;
import java.util.Optional;

public interface PostService {
    Post createPost(Post post);
    List<Post> getAllPosts();
    Optional<Post> getPostById(String id);
    List<Post> getPostsByUserId(String userId);
    List<Post> getPostsByTag(String tag);
    Post updatePost(String id, Post post);
    void deletePost(String id);
}