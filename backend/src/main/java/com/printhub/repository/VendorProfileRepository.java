/**
 * VendorProfileRepository - Data access for business profile records.
 */
package com.printhub.repository;

import com.printhub.model.User;
import com.printhub.model.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    Optional<VendorProfile> findByUser(User user);

    Optional<VendorProfile> findByUserId(Long userId);
}
