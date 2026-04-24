package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Prediction;
import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.dto.PredictionDTO;
import com.shrimpfarm.backend.repository.PondRepository;
import com.shrimpfarm.backend.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    private final PredictionRepository predictionRepository;
    private final PondRepository pondRepository;
    private final RestTemplate restTemplate;

    private final String pythonUrl = "http://localhost:8000/predict";

    // Lấy tất cả dự đoán của ao
    public List<Prediction> getPredictions(Long pondId) {
        return predictionRepository.findByPondIdOrderByPredictedAtDesc(pondId);
    }

    // Lấy dự đoán mới nhất
    public Prediction getLatestPrediction(Long pondId) {
        return predictionRepository
                .findTopByPondIdOrderByPredictedAtDesc(pondId)
                .orElseThrow(() -> new RuntimeException("No prediction found"));
    }

    // Gọi Python AI và lưu kết quả
    public Prediction predict(PredictionDTO dto) {
        Pond pond = pondRepository.findById(dto.getPondId())
                .orElseThrow(() -> new RuntimeException("Pond not found"));

        // Chuẩn bị data gửi sang Python
        Map<String, Object> request = new HashMap<>();
        request.put("pond_id", dto.getPondId());
        request.put("ph", dto.getPh());
        request.put("temperature", dto.getTemperature());
        request.put("oxygen", dto.getOxygen());

        Prediction.RiskLevel riskLevel;
        int riskPercent;
        String recommendation;

        try {
            // Gọi Python FastAPI
            Map response = restTemplate.postForObject(
                    pythonUrl, request, Map.class
            );

            String level = (String) response.get("risk_level");
            riskPercent = (Integer) response.get("risk_percent");
            riskLevel = Prediction.RiskLevel.valueOf(level);
            recommendation = buildRecommendation(riskLevel, dto);

        } catch (Exception e) {
            // Python chưa chạy → dùng rule-based đơn giản
            riskLevel = calculateRiskManually(dto);
            riskPercent = calculateRiskPercent(dto);
            recommendation = buildRecommendation(riskLevel, dto);
        }

        // Lưu kết quả vào database
        Prediction prediction = Prediction.builder()
                .pond(pond)
                .riskLevel(riskLevel)
                .riskPercent(riskPercent)
                .recommendation(recommendation)
                .build();

        return predictionRepository.save(prediction);
    }

    // Tính risk thủ công khi Python chưa chạy
    private Prediction.RiskLevel calculateRiskManually(PredictionDTO dto) {
        int score = 0;
        if (dto.getOxygen() != null && dto.getOxygen() < 4.0) score += 3;
        if (dto.getPh() != null && (dto.getPh() > 8.5 || dto.getPh() < 6.5)) score += 2;
        if (dto.getTemperature() != null && dto.getTemperature() > 32) score += 1;

        if (score >= 4) return Prediction.RiskLevel.HIGH;
        if (score >= 2) return Prediction.RiskLevel.MEDIUM;
        return Prediction.RiskLevel.LOW;
    }

    private int calculateRiskPercent(PredictionDTO dto) {
        int score = 0;
        if (dto.getOxygen() != null && dto.getOxygen() < 4.0) score += 40;
        if (dto.getPh() != null && (dto.getPh() > 8.5 || dto.getPh() < 6.5)) score += 30;
        if (dto.getTemperature() != null && dto.getTemperature() > 32) score += 20;
        return Math.min(score, 100);
    }

    private String buildRecommendation(Prediction.RiskLevel level, PredictionDTO dto) {
        if (level == Prediction.RiskLevel.HIGH)
            return "Nguy hiểm: Kiểm tra ngay oxy và pH, bật quạt oxy, xử lý vôi nếu pH cao.";
        if (level == Prediction.RiskLevel.MEDIUM)
            return "Cảnh báo: Theo dõi chặt chỉ số nước, chuẩn bị xử lý nếu tiếp tục xấu.";
        return "Môi trường ao ổn định, không cần can thiệp.";
    }
}