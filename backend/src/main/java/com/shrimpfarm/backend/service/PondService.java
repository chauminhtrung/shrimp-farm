package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.PondDTO;
import com.shrimpfarm.backend.repository.PondRepository;
import com.shrimpfarm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PondService {

    private final PondRepository pondRepository;
    private final UserRepository userRepository;

    // Lấy tất cả ao của 1 user
    public List<Pond> getPondsByUser(Long userId) {
        return pondRepository.findByUserId(userId);
    }

    // Lấy 1 ao theo id
    public Pond getPondById(Long id) {
        return pondRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pond not found: " + id));
    }

    // Tạo ao mới
    public Pond createPond(PondDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pond pond = Pond.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .area(dto.getArea())
                .width(dto.getWidth())
                .height(dto.getHeight())
                .user(user)
                .build();

        return pondRepository.save(pond);
    }

    // Cập nhật ao
    public Pond updatePond(Long id, PondDTO dto) {
        Pond pond = getPondById(id);
        pond.setName(dto.getName());
        pond.setLocation(dto.getLocation());
        pond.setArea(dto.getArea());
        pond.setWidth(dto.getWidth());
        pond.setHeight(dto.getHeight());
        return pondRepository.save(pond);
    }

    // Xóa ao
    public void deletePond(Long id) {
        pondRepository.deleteById(id);
    }
}