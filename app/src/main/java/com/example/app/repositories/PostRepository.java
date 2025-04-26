package com.example.app.repositories;

import com.example.app.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUser_Id(String userId); // Corrected to match the user.id property

    @Query("{ 'user.$id' : ?0 }")
    List<Post> findByUserId(String userId);
}