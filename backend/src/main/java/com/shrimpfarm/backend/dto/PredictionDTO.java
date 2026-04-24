package com.shrimpfarm.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionDTO {
    private Long pondId;
    private Double ph;
    private Double temperature;
    private Double oxygen;
}