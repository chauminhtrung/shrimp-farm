package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

    // Lấy tất cả dữ liệu của 1 ao — dùng cho biểu đồ
    List<SensorData> findByPondIdOrderByRecordedAtDesc(Long pondId);

    // Lấy dữ liệu mới nhất của 1 ao — dùng cho dashboard
    Optional<SensorData> findTopByPondIdOrderByRecordedAtDesc(Long pondId);
}