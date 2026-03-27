/**
 * VendorController - Manages printing provider ecosystem data.
 * Facilitates vendor discovery for customers and profile management for providers.
 */
package com.printhub.controller;

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
     * Retrieves a list of all active printing vendors.
     * 
     * @return List of vendor profiles.
     */
    @GetMapping
    public ResponseEntity<List<VendorProfile>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorProfile> getVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @GetMapping("/eligible")
    public ResponseEntity<List<VendorProfile>> getEligibleVendors(
            @RequestParam String material,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(vendorService.getEligibleVendors(material, quantity));
    }

    /**
     * Updates a vendor's business profile (Pricing, Capacity, Materials).
     * 
     * @param profile The updated profile data.
     * @return The persisted profile.
     */
    @PutMapping("/profile")
    public ResponseEntity<VendorProfile> updateProfile(@RequestBody VendorProfile profile) {
        return ResponseEntity.ok(vendorService.updateProfile(profile));
    }
}
