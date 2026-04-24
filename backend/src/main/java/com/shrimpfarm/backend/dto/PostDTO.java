package com.shrimpfarm.backend.dto;

import com.shrimpfarm.backend.Entity.Post.PostTag;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long userId;
    private String title;
    private String content;
    private PostTag tag;
}