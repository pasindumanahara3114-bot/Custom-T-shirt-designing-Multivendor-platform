package com.printhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_designs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(name = "front_preview_url", columnDefinition = "LONGTEXT")
    private String frontPreviewUrl;

    @Column(name = "back_preview_url", columnDefinition = "LONGTEXT")
    private String backPreviewUrl;

    @Column(name = "design_json", columnDefinition = "LONGTEXT")
    private String designJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
