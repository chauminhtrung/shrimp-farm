package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Comment;
import com.shrimpfarm.backend.dto.CommentDTO;
import com.shrimpfarm.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // GET /api/comments?postId=1
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@RequestParam Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // POST /api/comments
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody CommentDTO dto) {
        return ResponseEntity.ok(commentService.createComment(dto));
    }

    // DELETE /api/comments/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
