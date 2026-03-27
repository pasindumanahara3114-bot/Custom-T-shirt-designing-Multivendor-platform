/**
 * OrderController - Orchestrates the custom T-shirt production lifecycle.
 * Handles order placement (including master design JSON), project-wide status tracking, 
 * and vendor-side production updates.
 */
package com.printhub.controller;

import com.printhub.dto.OrderDTO;
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
     */
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody com.printhub.dto.OrderRequestDTO orderRequest) {
        return ResponseEntity.ok(orderService.placeOrder(orderRequest));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<OrderDTO>> getVendorOrders(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getOrdersByVendorId(vendorId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getCustomerOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
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

    @GetMapping("/{id}/blueprint")
    public ResponseEntity<byte[]> downloadBlueprint(@PathVariable String id) {
        OrderDTO order = orderService.getAllOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found"));

        byte[] content = order.getDesignJson().getBytes();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + id + "-blueprint.json\"")
                .header("Content-Type", "application/json")
                .body(content);
    }

    @GetMapping("/{id}/hd-preview")
    public ResponseEntity<byte[]> downloadHDPreview(@PathVariable String id) {
        OrderDTO order = orderService.getAllOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Redirecting or serving the original design URL
        // If it's a data URL (base64) from fabric.js, we should handle it
        return ResponseEntity.status(302)
                .header("Location", order.getDesignUrl())
                .build();
    }
}
