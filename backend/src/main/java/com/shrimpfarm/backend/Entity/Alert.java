package com.shrimpfarm.backend.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    private String message;

    @Enumerated(EnumType.STRING)
    private AlertLevel level;

    @Enumerated(EnumType.STRING)
    private AlertType type;

    private Boolean isRead = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum AlertLevel {
        WARNING, DANGER
    }

    public enum AlertType {
        PH, OXYGEN, TEMPERATURE
    }
}