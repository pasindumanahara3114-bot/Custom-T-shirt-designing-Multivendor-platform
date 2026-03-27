package com.printhub.service;

import com.printhub.dto.OrderDTO;
import com.printhub.dto.OrderRequestDTO;
import com.printhub.model.Order;
import com.printhub.model.Order.OrderStatus;
import com.printhub.repository.OrderRepository;
import com.printhub.repository.UserRepository;
import com.printhub.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private VendorProfileRepository vendorRepository;

        /**
         * Persists a new order along with its associated design metadata.
         */
        public OrderDTO placeOrder(OrderRequestDTO request) {
                Order order = new Order();

                // Find Customer by email
                com.printhub.model.User customer = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException(
                                                "Customer not found with email: " + request.getEmail()));

                // Find Vendor by ID
                com.printhub.model.VendorProfile vendor = vendorRepository.findById(request.getVendorId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Vendor not found with ID: " + request.getVendorId()));

                // Generate ID: ORD-TIMESTAMP
                String orderId = "ORD-" + (System.currentTimeMillis() % 1000000);
                order.setId(orderId);

                order.setCustomer(customer);
                order.setVendor(vendor);
                order.setMaterial(request.getMaterial());
                order.setQuantity(request.getQuantity());
                order.setSize(request.getSize());
                order.setDesignUrl(request.getDesignUrl());
                order.setDesignJson(request.getDesignJson());
                order.setExpectedDate(request.getExpectedDate() != null ? request.getExpectedDate()
                                : LocalDate.now().plusDays(7));
                order.setStatus(Order.OrderStatus.PLACED);
                order.setOrderDate(java.time.LocalDateTime.now());

                // Calculate total price (Simplified: vendor pricePerUnit * quantity)
                double unitPrice = vendor.getPricePerUnit() != null ? vendor.getPricePerUnit() : 1200.0;
                order.setTotalPrice(unitPrice * request.getQuantity());

                Order savedOrder = orderRepository.save(order);
                return mapToDTO(savedOrder);
        }

        public List<OrderDTO> getAllOrders() {
                return orderRepository.findAll().stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Retrieves all orders assigned to a specific vendor.
         */
        public List<OrderDTO> getOrdersByVendorId(Long vendorId) {
                return orderRepository.findAll().stream()
                                .filter(o -> o.getVendor() != null && o.getVendor().getId().equals(vendorId))
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Retrieves all orders placed by a specific customer.
         */
        public List<OrderDTO> getOrdersByCustomerId(Long customerId) {
                return orderRepository.findAll().stream()
                                .filter(o -> o.getCustomer() != null && o.getCustomer().getId().equals(customerId))
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        public OrderDTO updateStatus(String orderId, OrderStatus newStatus) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));
                order.setStatus(newStatus);
                return mapToDTO(orderRepository.save(order));
        }

        private OrderDTO mapToDTO(Order order) {
                return new OrderDTO(
                                order.getId(),
                                order.getCustomer() != null ? order.getCustomer().getId() : null,
                                order.getVendor() != null ? order.getVendor().getId() : null,
                                order.getMaterial(),
                                order.getQuantity(),
                                order.getSize(),
                                order.getStatus(),
                                order.getOrderDate(),
                                order.getExpectedDate(),
                                order.getDesignUrl(),
                                order.getDesignJson(),
                                order.getTotalPrice(),
                                order.getCustomer() != null ? order.getCustomer().getName() : "Anonymous");
        }
}
