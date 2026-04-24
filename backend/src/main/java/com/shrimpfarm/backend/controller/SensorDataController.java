package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.SensorData;
import com.shrimpfarm.backend.dto.SensorDataDTO;
import com.shrimpfarm.backend.service.SensorDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sensor")
@RequiredArgsConstructor
public class SensorDataController {

    private final SensorDataService sensorDataService;

    // GET /api/sensor/history/1 — lịch sử dữ liệu cho biểu đồ
    @GetMapping("/history/{pondId}")
    public ResponseEntity<List<SensorData>> getHistory(@PathVariable Long pondId) {
        return ResponseEntity.ok(sensorDataService.getHistory(pondId));
    }

    // GET /api/sensor/latest/1 — dữ liệu mới nhất cho dashboard
    @GetMapping("/latest/{pondId}")
    public ResponseEntity<SensorData> getLatest(@PathVariable Long pondId) {
        return ResponseEntity.ok(sensorDataService.getLatest(pondId));
    }

    // POST /api/sensor — ESP32 hoặc simulator gửi lên
    @PostMapping
    public ResponseEntity<SensorData> receive(@RequestBody SensorDataDTO dto) {
        return ResponseEntity.ok(sensorDataService.receiveSensorData(dto));
    }
}