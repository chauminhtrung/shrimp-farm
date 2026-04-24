package com.shrimpfarm.backend.service;

import com.shrimpfarm.backend.Entity.Device;
import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.dto.DeviceDTO;
import com.shrimpfarm.backend.repository.DeviceRepository;
import com.shrimpfarm.backend.repository.PondRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final PondRepository pondRepository;

    // Lấy tất cả thiết bị của 1 ao
    public List<Device> getDevicesByPond(Long pondId) {
        return deviceRepository.findByPondId(pondId);
    }

    // Lấy 1 thiết bị theo id
    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found: " + id));
    }

    // Thêm thiết bị vào ao
    public Device createDevice(DeviceDTO dto) {
        Pond pond = pondRepository.findById(dto.getPondId())
                .orElseThrow(() -> new RuntimeException("Pond not found"));

        Device device = Device.builder()
                .pond(pond)
                .name(dto.getName())
                .type(dto.getType())
                .posX(dto.getPosX())
                .posY(dto.getPosY())
                .status(Device.DeviceStatus.OFF)
                .build();

        return deviceRepository.save(device);
    }

    // Cập nhật vị trí thiết bị — dùng khi kéo thả trên pond map
    public Device updateDevice(Long id, DeviceDTO dto) {
        Device device = getDeviceById(id);
        device.setName(dto.getName());
        device.setPosX(dto.getPosX());
        device.setPosY(dto.getPosY());
        device.setStatus(dto.getStatus());
        return deviceRepository.save(device);
    }

    // Xóa thiết bị
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }
}