package com.printhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "vendor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    private String contact;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_qty")
    private Integer minQty = 1;

    @Column(name = "max_qty")
    private Integer maxQty = 1000;

    @Column(name = "price_per_unit")
    private Double pricePerUnit = 0.0;

    @ElementCollection
    @CollectionTable(name = "vendor_materials", joinColumns = @JoinColumn(name = "vendor_id"))
    @Column(name = "material_name")
    private List<String> materials;
}
