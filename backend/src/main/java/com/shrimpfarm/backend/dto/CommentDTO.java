package com.shrimpfarm.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long postId;
    private Long userId;
    private String content;
}