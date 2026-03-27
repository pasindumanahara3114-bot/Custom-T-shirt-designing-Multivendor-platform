package com.printhub.service;

import com.printhub.dto.OrderDTO;
import com.printhub.model.Order;
import com.printhub.model.Order.OrderStatus;
import com.printhub.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * OrderService - Handles order placement, tracking, and status updates.
 */
/**
 * OrderService - Orchestrates the core production pipeline.
 * Manages the persistence of complex design blueprints (Design JSON) and
 * coordinates
 * status transitions between Customers and Vendors.
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Persists a new order along with its associated design metadata.
     * 
     * @param order The raw order entity.
     * @return Transformed OrderDTO for API response.
     */
    public OrderDTO placeOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing order's status in the production lifecycle.
     * 
     * @param orderId   Unique identifier (e.g., ORD-1024).
     * @param newStatus The target status.
     * @return The updated order data.
     */
    public OrderDTO updateStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return mapToDTO(orderRepository.save(order));
    }

    private OrderDTO mapToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getCustomer().getId(),
                order.getVendor().getId(),
                order.getMaterial(),
                order.getQuantity(),
                order.getSize(),
                order.getStatus(),
                order.getOrderDate(),
                order.getExpectedDate(),
                order.getDesignUrl(),
                order.getDesignJson(),
                order.getTotalPrice());
    }
}
