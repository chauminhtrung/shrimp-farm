package com.shrimpfarm.backend.dto;

import com.shrimpfarm.backend.Entity.Device.DeviceStatus;
import com.shrimpfarm.backend.Entity.Device.DeviceType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceDTO {
    private Long id;
    private Long pondId;
    private String name;
    private DeviceType type;
    private Double posX;
    private Double posY;
    private DeviceStatus status;
}