package com.example.app.services;

import com.example.app.models.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {
    Comment createComment(Comment comment, String postId, String userId);
    Optional<Comment> getCommentById(String id);
    List<Comment> getCommentsByPostId(String postId);
    Comment updateComment(String id, String userId, String content);
    void deleteComment(String id, String userId, String postOwnerId);
}