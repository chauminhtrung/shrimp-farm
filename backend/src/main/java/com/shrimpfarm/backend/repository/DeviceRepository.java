package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByPondId(Long pondId);
}