package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Post;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.repository.*;
import com.shrimpfarm.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PondRepository pondRepository;
    private final PostRepository postRepository;
    private final AlertRepository alertRepository;
    private final SensorDataRepository sensorDataRepository;
    private final PostService postService;

    // Thống kê tổng quan
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",    userRepository.count());
        stats.put("totalPonds",    pondRepository.count());
        stats.put("totalPosts",    postRepository.count());
        stats.put("pendingPosts",  postRepository
                .findByStatusOrderByCreatedAtDesc(Post.PostStatus.PENDING).size());
        stats.put("totalAlerts",   alertRepository.count());
        stats.put("totalSensors",  sensorDataRepository.count());
        return ResponseEntity.ok(stats);
    }

    // Danh sách tất cả user
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Khóa / mở khóa user
    @PutMapping("/users/{id}/toggle-lock")
    public ResponseEntity<User> toggleLock(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLocked(!Boolean.TRUE.equals(user.getLocked()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Danh sách bài chờ duyệt
    @GetMapping("/posts/pending")
    public ResponseEntity<List<Post>> getPendingPosts() {
        return ResponseEntity.ok(
                postRepository.findByStatusOrderByCreatedAtDesc(Post.PostStatus.PENDING)
        );
    }

    // Duyệt bài
    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<Post> approve(@PathVariable Long id) {
        return ResponseEntity.ok(postService.approvePost(id));
    }

    // Từ chối bài
    @PutMapping("/posts/{id}/reject")
    public ResponseEntity<Post> reject(@PathVariable Long id) {
        return ResponseEntity.ok(postService.rejectPost(id));
    }

    // Xóa bài
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}