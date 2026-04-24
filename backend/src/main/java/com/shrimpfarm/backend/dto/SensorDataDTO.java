package com.shrimpfarm.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorDataDTO {
    private Long pondId;
    private Double temperature;
    private Double ph;
    private Double oxygen;
    private Double turbidity;
}