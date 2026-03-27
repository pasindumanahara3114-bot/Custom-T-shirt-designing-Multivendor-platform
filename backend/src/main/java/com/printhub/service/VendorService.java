package com.printhub.service;

import com.printhub.model.VendorProfile;
import com.printhub.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * VendorService - Handles vendor profile management and service listings.
 */
/**
 * VendorService - Manages the vendor profile lifecycle.
 * Provides logic for material selection, pricing updates, and provider
 * discovery.
 */
@Service
public class VendorService {

    @Autowired
    private VendorProfileRepository vendorProfileRepository;

    public VendorProfile updateProfile(VendorProfile profile) {
        return vendorProfileRepository.save(profile);
    }

    public List<VendorProfile> getAllVendors() {
        return vendorProfileRepository.findAll();
    }

    public VendorProfile getVendorById(Long id) {
        return vendorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }
}
