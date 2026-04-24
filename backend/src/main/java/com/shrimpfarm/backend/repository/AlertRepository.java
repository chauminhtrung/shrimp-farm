package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByPondIdOrderByCreatedAtDesc(Long pondId);
    List<Alert> findByPondIdAndIsReadFalse(Long pondId);
}