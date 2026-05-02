package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Post;
import com.shrimpfarm.backend.Entity.PostLike;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.PostDTO;
import com.shrimpfarm.backend.repository.PostLikeRepository;
import com.shrimpfarm.backend.repository.PostRepository;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    @Autowired
    private PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    @Autowired
    private final UserRepository userRepository;

    public List<Post> getAllPosts() {
        return postRepository.findByStatusOrderByCreatedAtDesc(
                Post.PostStatus.APPROVED);
    }


    // Thêm hàm approve cho Admin
    public Post approvePost(Long id) {
        Post post = getPostById(id);
        post.setStatus(Post.PostStatus.APPROVED);
        return postRepository.save(post);
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
    public Post toggleLike(Long postId, Long userId) {
        Post post = getPostById(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<PostLike> existing = postLikeRepository
                .findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            // Đã like → bỏ like
            postLikeRepository.delete(existing.get());
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            // Chưa like → thêm like
            PostLike like = PostLike.builder()
                    .post(post).user(user).build();
            postLikeRepository.save(like);
            post.setLikes(post.getLikes() + 1);
        }
        return postRepository.save(post);
    }

    // Xóa bài viết
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }



}