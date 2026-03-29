package com.printhub.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OrderRequestDTO {
    private String name;
    private String email;
    private String material;
    private Integer quantity;
    private String size;
    private String designUrl;
    private String designJson;
    private Long vendorId;
    private String status;
    private LocalDate expectedDate;
    private String address;
}
