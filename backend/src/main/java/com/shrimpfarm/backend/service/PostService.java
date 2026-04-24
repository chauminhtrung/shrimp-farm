package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Post;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.PostDTO;
import com.shrimpfarm.backend.repository.PostRepository;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Lấy tất cả bài viết
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // Lọc theo tag
    public List<Post> getPostsByTag(Post.PostTag tag) {
        return postRepository.findByTagOrderByCreatedAtDesc(tag);
    }

    // Tìm kiếm theo từ khóa
    public List<Post> searchPosts(String keyword) {
        return postRepository
                .findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
    }

    // Lấy 1 bài viết
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
    }

    // Đăng bài mới
    public Post createPost(PostDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = Post.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .tag(dto.getTag())
                .likes(0)
                .build();

        return postRepository.save(post);
    }

    // Thích bài viết
    public Post likePost(Long id) {
        Post post = getPostById(id);
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    // Xóa bài viết
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}