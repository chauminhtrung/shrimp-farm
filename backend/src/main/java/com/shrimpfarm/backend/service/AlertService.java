package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Alert;
import com.shrimpfarm.backend.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    // Lấy tất cả cảnh báo của ao
    public List<Alert> getAlertsByPond(Long pondId) {
        return alertRepository.findByPondIdOrderByCreatedAtDesc(pondId);
    }

    // Lấy cảnh báo chưa đọc của ao — dùng cho badge đỏ trên topbar
    public List<Alert> getUnreadAlerts(Long pondId) {
        return alertRepository.findByPondIdAndIsReadFalse(pondId);
    }

    // Đánh dấu đã đọc 1 cảnh báo
    public Alert markAsRead(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found: " + id));
        alert.setIsRead(true);
        return alertRepository.save(alert);
    }

    // Đánh dấu đã đọc tất cả cảnh báo của ao
    public void markAllAsRead(Long pondId) {
        List<Alert> unread = alertRepository.findByPondIdAndIsReadFalse(pondId);
        unread.forEach(alert -> alert.setIsRead(true));
        alertRepository.saveAll(unread);
    }

    // Xóa cảnh báo
    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }
}