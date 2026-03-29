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

    /**
     * Returns earnings summary for a vendor (total, pending, completed count).
     */
    @GetMapping("/vendor/{vendorId}/earnings")
    public ResponseEntity<java.util.Map<String, Object>> getVendorEarnings(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getVendorEarnings(vendorId));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<Object> downloadHDPreview(@PathVariable String id) {
        OrderDTO order = orderService.getAllOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String designUrl = order.getDesignUrl();

        if (designUrl != null && designUrl.startsWith("data:image")) {
            try {
                // Parse base64
                String base64Image = designUrl.split(",")[1];
                byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
                String contentType = designUrl.split(":")[1].split(";")[0];

                return ResponseEntity.ok()
                        .header("Content-Type", contentType)
                        .header("Content-Disposition", "inline; filename=\"" + id + "-preview.png\"")
                        .body(imageBytes);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }

        // Fallback to redirect if it's a remote URL
        return ResponseEntity.status(302)
                .header("Location", designUrl)
                .build();
    }
}
