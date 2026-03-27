package com.printhub.repository;

import com.printhub.model.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
}
