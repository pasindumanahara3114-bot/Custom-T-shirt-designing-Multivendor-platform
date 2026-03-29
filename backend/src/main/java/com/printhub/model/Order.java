/**
 * Order Entity - Represents a custom T-shirt print request.
 * Stores high-resolution design URLs and the raw JSON master blueprint.
 */
package com.printhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id; // Format: ORD-XXXX

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(nullable = false)
    private String material;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PLACED;

    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "expected_date")
    private LocalDate expectedDate;

    @Column(name = "design_url", columnDefinition = "LONGTEXT")
    private String designUrl;

    @Column(name = "design_json", columnDefinition = "LONGTEXT")
    private String designJson;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    public enum OrderStatus {
        PLACED, ACCEPTED, IN_PRODUCTION, READY_FOR_DELIVERY
    }
}
