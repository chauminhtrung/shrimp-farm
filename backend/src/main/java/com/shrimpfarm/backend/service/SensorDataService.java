package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Alert;
import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.Entity.SensorData;
import com.shrimpfarm.backend.dto.SensorDataDTO;
import com.shrimpfarm.backend.repository.AlertRepository;
import com.shrimpfarm.backend.repository.PondRepository;
import com.shrimpfarm.backend.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorDataService {

    private final SensorDataRepository sensorDataRepository;
    private final PondRepository pondRepository;
    private final AlertRepository alertRepository;

    // Lấy lịch sử dữ liệu của ao — dùng cho biểu đồ Recharts
    public List<SensorData> getHistory(Long pondId) {
        return sensorDataRepository.findByPondIdOrderByRecordedAtDesc(pondId);
    }

    // Lấy dữ liệu mới nhất của ao — dùng cho dashboard realtime
    public SensorData getLatest(Long pondId) {
        return sensorDataRepository
                .findTopByPondIdOrderByRecordedAtDesc(pondId)
                .orElseThrow(() -> new RuntimeException("No sensor data for pond: " + pondId));
    }

    // Nhận dữ liệu từ ESP32 hoặc simulator — tự động kiểm tra ngưỡng
    public SensorData receiveSensorData(SensorDataDTO dto) {
        Pond pond = pondRepository.findById(dto.getPondId())
                .orElseThrow(() -> new RuntimeException("Pond not found"));

        // Lưu dữ liệu sensor
        SensorData data = SensorData.builder()
                .pond(pond)
                .temperature(dto.getTemperature())
                .ph(dto.getPh())
                .oxygen(dto.getOxygen())
                .turbidity(dto.getTurbidity())
                .build();

        SensorData saved = sensorDataRepository.save(data);

        // Tự động tạo cảnh báo nếu vượt ngưỡng
        checkAndCreateAlert(pond, dto);

        return saved;
    }

    // Kiểm tra ngưỡng và tạo Alert tự động
    private void checkAndCreateAlert(Pond pond, SensorDataDTO dto) {

        if (dto.getOxygen() != null && dto.getOxygen() < 4.0) {
            Alert alert = Alert.builder()
                    .pond(pond)
                    .message("Oxy hòa tan thấp: " + dto.getOxygen() + " mg/L")
                    .level(Alert.AlertLevel.DANGER)
                    .type(Alert.AlertType.OXYGEN)
                    .isRead(false)
                    .build();
            alertRepository.save(alert);
        }

        if (dto.getPh() != null && dto.getPh() > 8.5) {
            Alert alert = Alert.builder()
                    .pond(pond)
                    .message("pH cao: " + dto.getPh())
                    .level(Alert.AlertLevel.WARNING)
                    .type(Alert.AlertType.PH)
                    .isRead(false)
                    .build();
            alertRepository.save(alert);
        }

        if (dto.getPh() != null && dto.getPh() < 6.5) {
            Alert alert = Alert.builder()
                    .pond(pond)
                    .message("pH thấp: " + dto.getPh())
                    .level(Alert.AlertLevel.WARNING)
                    .type(Alert.AlertType.PH)
                    .isRead(false)
                    .build();
            alertRepository.save(alert);
        }

        if (dto.getTemperature() != null && dto.getTemperature() > 32.0) {
            Alert alert = Alert.builder()
                    .pond(pond)
                    .message("Nhiệt độ cao: " + dto.getTemperature() + "°C")
                    .level(Alert.AlertLevel.WARNING)
                    .type(Alert.AlertType.TEMPERATURE)
                    .isRead(false)
                    .build();
            alertRepository.save(alert);
        }
    }
}