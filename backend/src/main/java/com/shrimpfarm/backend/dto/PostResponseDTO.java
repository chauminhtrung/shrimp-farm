package com.shrimpfarm.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String tag;
    private Integer likes;
    private String status;
    private String imageUrl;
    private LocalDateTime createdAt;
    // Thông tin người đăng
    private Long userId;
    private String username;
    private String fullName;
    private String avatarUrl;
}