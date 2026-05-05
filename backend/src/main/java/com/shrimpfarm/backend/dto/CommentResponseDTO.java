package com.shrimpfarm.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long postId;
    private String content;
    private LocalDateTime createdAt;
    // Thông tin người comment
    private Long userId;
    private String username;
    private String fullName;
    private String avatarUrl;
}