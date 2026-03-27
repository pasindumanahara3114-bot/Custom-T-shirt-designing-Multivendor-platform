/**
 * OrderController - Orchestrates the custom T-shirt production lifecycle.
 * Handles order placement (including master design JSON), project-wide status tracking, 
 * and vendor-side production updates.
 */
package com.printhub.controller;

import com.printhub.dto.OrderDTO;
import com.printhub.model.Order;
import com.printhub.model.Order.OrderStatus;
import com.printhub.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Submits a new custom design order.
     * Captures essential production metadata: designUrl (preview) and designJson
     * (blueprint).
     * 
     * @param order The order entity from the customer.
     * @return The persisted order as a DTO.
     */
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.placeOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Updates an order's position in the production flow.
     * Common transitions: PLACED -> ACCEPTED -> IN_PRODUCTION ->
     * READY_FOR_DELIVERY.
     * 
     * @param id     The unique ORD- identifier.
     * @param status The new status Enum.
     * @return Updated OrderDTO.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable String id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
