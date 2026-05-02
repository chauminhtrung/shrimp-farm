package com.shrimpfarm.backend.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {
    private String fullName;
    private String email;
    private String currentPassword;
    private String newPassword;
    private String avatarUrl;
}