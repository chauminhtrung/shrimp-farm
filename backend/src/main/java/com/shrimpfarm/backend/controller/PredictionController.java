package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Prediction;
import com.shrimpfarm.backend.dto.PredictionDTO;
import com.shrimpfarm.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/predict")
@RequiredArgsConstructor
public class PredictionController {

    private final AIService aiService;

    // GET /api/predict?pondId=1 — tất cả dự đoán
    @GetMapping
    public ResponseEntity<List<Prediction>> getPredictions(@RequestParam Long pondId) {
        return ResponseEntity.ok(aiService.getPredictions(pondId));
    }

    // GET /api/predict/latest/1 — dự đoán mới nhất
    @GetMapping("/latest/{pondId}")
    public ResponseEntity<Prediction> getLatest(@PathVariable Long pondId) {
        return ResponseEntity.ok(aiService.getLatestPrediction(pondId));
    }

    // POST /api/predict — gọi AI dự đoán
    @PostMapping
    public ResponseEntity<Prediction> predict(@RequestBody PredictionDTO dto) {
        return ResponseEntity.ok(aiService.predict(dto));
    }
}