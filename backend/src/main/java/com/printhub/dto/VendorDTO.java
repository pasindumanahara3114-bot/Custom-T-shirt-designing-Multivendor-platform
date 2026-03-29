/**
 * VendorDTO - Safe data transfer object for vendor profiles.
 * Exposes only the fields needed by the frontend — no sensitive User data.
 */
package com.printhub.dto;

import java.util.List;

public class VendorDTO {

    private Long id;
    private String name; // businessName
    private String location;
    private String description;
    private Integer minQty;
    private Integer maxQty;
    private Double price; // pricePerUnit
    private List<String> materials;

    // Default constructor
    public VendorDTO() {
    }

    // Full constructor
    public VendorDTO(Long id, String name, String location, String description,
            Integer minQty, Integer maxQty, Double price, List<String> materials) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
        this.minQty = minQty;
        this.maxQty = maxQty;
        this.price = price;
        this.materials = materials;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMinQty() {
        return minQty;
    }

    public void setMinQty(Integer minQty) {
        this.minQty = minQty;
    }

    public Integer getMaxQty() {
        return maxQty;
    }

    public void setMaxQty(Integer maxQty) {
        this.maxQty = maxQty;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<String> getMaterials() {
        return materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }
}
