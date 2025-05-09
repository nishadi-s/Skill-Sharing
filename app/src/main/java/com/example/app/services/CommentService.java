package com.example.app.services;

import com.example.app.models.Comment;
import com.example.app.models.Post;
import com.example.app.repositories.CommentRepository;
import com.example.app.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment createComment(String postId, Comment comment) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(new java.util.Date());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        Post post = postOptional.orElseThrow(() -> new RuntimeException("Post not found"));
        return commentRepository.findByPost(post);
    }

    public Comment updateComment(String commentId, Comment updatedComment) {
        Optional<Comment> existingCommentOptional = commentRepository.findById(commentId);
        if (existingCommentOptional.isPresent()) {
            Comment comment = existingCommentOptional.get();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!comment.getUser().getEmail().equals(email)) {
                throw new SecurityException("Unauthorized to update this comment");
            }
            comment.setContent(updatedComment.getContent());
            return commentRepository.save(comment);
        }
        throw new RuntimeException("Comment not found");
    }

    public void deleteComment(String commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!comment.getUser().getEmail().equals(email)) {
                throw new SecurityException("Unauthorized to delete this comment");
            }
            commentRepository.deleteById(commentId);
        } else {
            throw new RuntimeException("Comment not found");
        }
    }
}