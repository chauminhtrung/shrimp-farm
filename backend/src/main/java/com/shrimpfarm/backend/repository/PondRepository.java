package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.Pond;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PondRepository extends JpaRepository<Pond, Long> {
    List<Pond> findByUserId(Long userId);
}