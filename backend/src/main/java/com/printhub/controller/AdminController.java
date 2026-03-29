package com.printhub.controller;

import com.printhub.dto.OrderDTO;
import com.printhub.dto.UserDTO;
import com.printhub.service.OrderService;
import com.printhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController - Central command for managing the platform.
 * Exposes system-wide statistics, user management, and global order tracking.
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    /**
     * Retrieves system-wide aggregates: total users, vendors, orders, and global revenue.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(orderService.getPlatformStats());
    }

    /**
     * Retrieves all registered users on the platform (Customers and Providers).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Deletes a user by ID. If the user is a Vendor, their associated profile is also deleted.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves transparent access to all orders placed across the entire platform.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
