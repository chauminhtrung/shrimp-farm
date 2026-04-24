package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Device;
import com.shrimpfarm.backend.dto.DeviceDTO;
import com.shrimpfarm.backend.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    // GET /api/devices?pondId=1
    @GetMapping
    public ResponseEntity<List<Device>> getDevices(@RequestParam Long pondId) {
        return ResponseEntity.ok(deviceService.getDevicesByPond(pondId));
    }

    // GET /api/devices/1
    @GetMapping("/{id}")
    public ResponseEntity<Device> getDevice(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    // POST /api/devices
    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody DeviceDTO dto) {
        return ResponseEntity.ok(deviceService.createDevice(dto));
    }

    // PUT /api/devices/1
    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long id,
                                               @RequestBody DeviceDTO dto) {
        return ResponseEntity.ok(deviceService.updateDevice(id, dto));
    }

    // DELETE /api/devices/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}