/**
 * VendorController - Manages printing provider ecosystem data.
 * Facilitates vendor discovery for customers and profile management for providers.
 */
package com.printhub.controller;

import com.printhub.dto.VendorDTO;
import com.printhub.model.VendorProfile;
import com.printhub.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    /**
     * Retrieves a list of all active printing vendors (raw entities, for admin
     * use).
     */
    @GetMapping
    public ResponseEntity<List<VendorProfile>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorProfile> getVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<VendorProfile> getVendorByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(vendorService.getVendorByUserId(userId));
    }

    /**
     * Returns eligible vendors filtered by material and quantity.
     * Returns VendorDTO (safe — no password/user fields).
     */
    @GetMapping("/eligible")
    public ResponseEntity<List<VendorDTO>> getEligibleVendors(
            @RequestParam String material,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(vendorService.getEligibleVendors(material, quantity));
    }

    /**
     * Updates a vendor's business profile (Pricing, Capacity, Materials).
     */
    @PutMapping("/profile")
    public ResponseEntity<VendorProfile> updateProfile(@RequestBody VendorProfile profile) {
        return ResponseEntity.ok(vendorService.updateProfile(profile));
    }
}
