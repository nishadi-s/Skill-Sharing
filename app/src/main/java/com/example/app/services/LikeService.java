package com.example.app.services;

import com.example.app.models.Like;
import com.example.app.models.Post;
import com.example.app.models.User;
import com.example.app.repositories.LikeRepository;
import com.example.app.repositories.PostRepository;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Like likePost(String postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        if (existingLike.isPresent()) {
            throw new RuntimeException("User has already liked this post");
        }

        Like like = new Like(user, post);
        return likeRepository.save(like);
    }

    public void unlikePost(String postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> likeOptional = likeRepository.findByUserAndPost(user, post);
        if (likeOptional.isPresent()) {
            likeRepository.delete(likeOptional.get());
        } else {
            throw new RuntimeException("Like not found");
        }
    }

    public List<Like> getLikesByPostId(String postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.findByPost(post);
    }
}