package com.example.app.repositories;

import com.example.app.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUser(com.example.app.models.User user);
    List<Post> findByTagsContaining(String tag);
}