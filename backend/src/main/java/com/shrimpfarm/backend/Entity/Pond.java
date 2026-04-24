package com.shrimpfarm.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Device> devices;

    @JsonIgnore
    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<SensorData> sensorDataList;

    @JsonIgnore
    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Prediction> predictions;

    @JsonIgnore
    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL)
    private List<Alert> alerts;
}