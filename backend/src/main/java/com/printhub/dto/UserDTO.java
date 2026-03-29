package com.printhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.printhub.model.User.Role;
import lombok.*;

/**
 * UserDTO - Data Transfer Object for User information.
 * Used for registration and profile responses to avoid exposing sensitive data
 * like passwords.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;

    @JsonProperty("profileComplete")
    private boolean profileComplete;
}
