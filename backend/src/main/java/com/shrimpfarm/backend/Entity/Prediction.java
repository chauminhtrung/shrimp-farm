package com.shrimpfarm.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Integer riskPercent;
    private String recommendation;

    @Column(updatable = false)
    private LocalDateTime predictedAt;

    @PrePersist
    protected void onCreate() {
        predictedAt = LocalDateTime.now();
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, UNKNOWN
    }
}