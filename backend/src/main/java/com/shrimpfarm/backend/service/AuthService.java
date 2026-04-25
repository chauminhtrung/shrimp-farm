package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.config.JwtUtils;
import com.shrimpfarm.backend.dto.*;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    // Đăng ký
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent())
            throw new RuntimeException("Username đã tồn tại");

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(User.Role.USER)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getUsername());

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getUsername(),
                saved.getRole().name()
        );
    }

    // Đăng nhập
    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Username không tồn tại"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Mật khẩu không đúng");

        String token = jwtUtils.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}