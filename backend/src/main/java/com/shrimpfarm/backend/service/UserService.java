package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.UpdateUserDTO;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // Lấy 1 ao theo id
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pond not found: " + id));
    }

    public User updateUser(Long id, UpdateUserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Xác nhận mật khẩu hiện tại
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword()))
            throw new RuntimeException("Mật khẩu hiện tại không đúng");

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        // Đổi mật khẩu nếu có nhập mới
        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }

        return userRepository.save(user);
    }
}