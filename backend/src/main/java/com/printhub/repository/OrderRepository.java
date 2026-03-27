/**
 * OrderRepository - Data access for custom production orders.
 */
/**
 * OrderRepository - Data access interface for production order persistence.
 */
package com.printhub.repository;

import com.printhub.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
}
