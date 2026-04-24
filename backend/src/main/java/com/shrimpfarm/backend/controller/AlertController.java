package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Alert;
import com.shrimpfarm.backend.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // GET /api/alerts?pondId=1 — tất cả cảnh báo của ao
    @GetMapping
    public ResponseEntity<List<Alert>> getAlerts(@RequestParam Long pondId) {
        return ResponseEntity.ok(alertService.getAlertsByPond(pondId));
    }

    // GET /api/alerts/unread?pondId=1 — cảnh báo chưa đọc
    @GetMapping("/unread")
    public ResponseEntity<List<Alert>> getUnread(@RequestParam Long pondId) {
        return ResponseEntity.ok(alertService.getUnreadAlerts(pondId));
    }

    // PUT /api/alerts/1/read — đánh dấu đã đọc 1 cảnh báo
    @PutMapping("/{id}/read")
    public ResponseEntity<Alert> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }

    // PUT /api/alerts/read-all?pondId=1 — đánh dấu đọc tất cả
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long pondId) {
        alertService.markAllAsRead(pondId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/alerts/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}