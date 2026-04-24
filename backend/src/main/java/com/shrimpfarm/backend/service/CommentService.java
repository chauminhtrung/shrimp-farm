package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Comment;
import com.shrimpfarm.backend.Entity.Post;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.CommentDTO;
import com.shrimpfarm.backend.repository.CommentRepository;
import com.shrimpfarm.backend.repository.PostRepository;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Lấy tất cả comment của bài viết
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    // Thêm comment
    public Comment createComment(CommentDTO dto) {
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(dto.getContent())
                .build();

        return commentRepository.save(comment);
    }

    // Xóa comment
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}