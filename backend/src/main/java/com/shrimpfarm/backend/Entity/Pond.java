package com.shrimpfarm.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ponds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pond {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String location;
    private Double area;
    private Double width;
    private Double height;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Device> devices;

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<SensorData> sensorDataList;

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Prediction> predictions;

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Alert> alerts;
}