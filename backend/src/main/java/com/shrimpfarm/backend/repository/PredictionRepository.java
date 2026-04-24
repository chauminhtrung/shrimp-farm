package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    // Lấy tất cả dự đoán của ao
    List<Prediction> findByPondIdOrderByPredictedAtDesc(Long pondId);

    // Lấy dự đoán mới nhất của ao
    Optional<Prediction> findTopByPondIdOrderByPredictedAtDesc(Long pondId);
}