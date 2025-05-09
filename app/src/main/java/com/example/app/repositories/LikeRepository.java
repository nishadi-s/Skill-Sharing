package com.example.app.repositories;

import com.example.app.models.Like;
import com.example.app.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPost(Post post);
    Optional<Like> findByUserAndPost(User user, Post post);
    void deleteByPost(Post post);
}
