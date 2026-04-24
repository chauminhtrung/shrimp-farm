package com.shrimpfarm.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PondDTO {
    private Long id;
    private String name;
    private String location;
    private Double area;
    private Double width;
    private Double height;
    private Long userId;
}