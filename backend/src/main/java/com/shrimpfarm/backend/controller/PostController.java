package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Post;
import com.shrimpfarm.backend.dto.PostDTO;
import com.shrimpfarm.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // GET /api/posts — tất cả bài viết
    @GetMapping
    public ResponseEntity<List<Post>> getPosts(
            @RequestParam(required = false) Post.PostTag tag,
            @RequestParam(required = false) String keyword) {

        if (keyword != null && !keyword.isEmpty())
            return ResponseEntity.ok(postService.searchPosts(keyword));
        if (tag != null)
            return ResponseEntity.ok(postService.getPostsByTag(tag));
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET /api/posts/1
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // POST /api/posts — đăng bài mới
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO dto) {
        return ResponseEntity.ok(postService.createPost(dto));
    }

    // PUT /api/posts/1/like — thích bài viết
    @PutMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    // DELETE /api/posts/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}