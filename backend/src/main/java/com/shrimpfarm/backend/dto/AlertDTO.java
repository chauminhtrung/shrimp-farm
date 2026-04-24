package com.shrimpfarm.backend.dto;

import com.shrimpfarm.backend.Entity.Alert.AlertLevel;
import com.shrimpfarm.backend.Entity.Alert.AlertType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertDTO {
    private Long pondId;
    private String message;
    private AlertLevel level;
    private AlertType type;
}