package com.shrimpfarm.backend.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String role;
    private String avatarUrl;  // ← thêm field này
}