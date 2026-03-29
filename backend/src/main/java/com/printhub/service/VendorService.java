package com.printhub.service;

import com.printhub.dto.VendorDTO;
import com.printhub.model.VendorProfile;
import com.printhub.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * VendorService - Manages vendor profile lifecycle.
 * Provides material/quantity-based filtering and safe DTO mapping.
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

    public VendorProfile getVendorByUserId(Long userId) {
        return vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for user ID: " + userId));
    }

    /**
     * Returns vendors eligible for the requested material and quantity.
     * Filtering logic:
     * 1. The vendor's materials list must contain the requested material
     * (case-insensitive).
     * 2. The requested quantity must be within the vendor's [minQty, maxQty] range.
     */
    public List<VendorDTO> getEligibleVendors(String material, Integer quantity) {
        return vendorProfileRepository.findAll().stream()
                .filter(v -> v.getMaterials() != null &&
                        v.getMaterials().stream()
                                .anyMatch(m -> m.equalsIgnoreCase(material)))
                .filter(v -> quantity >= (v.getMinQty() == null ? 1 : v.getMinQty()) &&
                        quantity <= (v.getMaxQty() == null ? Integer.MAX_VALUE : v.getMaxQty()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps a VendorProfile entity to a safe VendorDTO.
     */
    private VendorDTO toDTO(VendorProfile v) {
        VendorDTO dto = new VendorDTO();
        dto.setId(v.getId());
        dto.setName(v.getBusinessName());
        dto.setLocation(v.getLocation());
        dto.setDescription(v.getDescription());
        dto.setMinQty(v.getMinQty());
        dto.setMaxQty(v.getMaxQty());
        dto.setPrice(v.getPricePerUnit());
        dto.setMaterials(v.getMaterials());
        return dto;
    }
}
