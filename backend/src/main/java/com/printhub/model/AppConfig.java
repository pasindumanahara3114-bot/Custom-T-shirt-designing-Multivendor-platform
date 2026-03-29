package com.printhub.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Single row identifier to ensure only one config exists
    @Column(unique = true, nullable = false)
    private String configKey = "GLOBAL_SETTINGS";

    @Column(nullable = false)
    private Double vendorProfitPercentage = 2.0;

}
