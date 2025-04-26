package com.example.app.controllers;

import com.example.app.models.Comment;
import com.example.app.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Create a comment on a post
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable String postId,
            @RequestBody Comment comment,
            @RequestParam String userId) {
        Comment createdComment = commentService.createComment(comment, postId, userId);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // Get a comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get all comments for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String id,
            @RequestBody Comment comment,
            @RequestParam String userId) {
        try {
            Comment updatedComment = commentService.updateComment(id, userId, comment.getContent());
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam String postOwnerId) {
        try {
            commentService.deleteComment(id, userId, postOwnerId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}