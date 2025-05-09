package com.example.app.repositories;

import com.example.app.models.Comment;
import com.example.app.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPost(Post post);
    List<Comment> findByUser(User user);
    void deleteByPost(Post post);
}
