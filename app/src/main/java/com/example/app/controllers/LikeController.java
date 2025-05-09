package com.example.app.controllers;

import com.example.app.models.Like;
import com.example.app.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<Like> likePost(@PathVariable String postId) {
        try {
            Like like = likeService.likePost(postId);
            return ResponseEntity.ok(like);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User already liked this post")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }
            throw e;
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable String postId) {
        likeService.unlikePost(postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable String postId) {
        List<Like> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }
}