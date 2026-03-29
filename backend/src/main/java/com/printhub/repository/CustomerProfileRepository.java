package com.printhub.repository;

import com.printhub.model.CustomerProfile;
import com.printhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * CustomerProfileRepository - Data access for customer profile records.
 */
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByUser(User user);
}
