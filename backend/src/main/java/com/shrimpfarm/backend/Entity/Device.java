package com.shrimpfarm.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    private String name;

    @Enumerated(EnumType.STRING)
    private DeviceType type;

    private Double posX;
    private Double posY;

    @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.OFF;

    public enum DeviceType {
        FAN, SENSOR
    }

    public enum DeviceStatus {
        ON, OFF, ERROR
    }
}