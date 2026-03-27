/**
 * OrderDTO - Data Transfer Object for production order data.
 * Used for API responses to the frontend.
 */
package com.printhub.dto;

import com.printhub.model.Order.OrderStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * OrderDTO - Data Transfer Object for Order information.
 * Simplifies order data for API responses, including design previews and
 * status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String id;
    private Long customerId;
    private Long vendorId;
    private String material;
    private Integer quantity;
    private String size;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDate expectedDate;
    private String designUrl;
    private String designJson;
    private Double totalPrice;
    private String customerName;
}
