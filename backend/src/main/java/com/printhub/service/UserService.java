package com.printhub.service;

import com.printhub.dto.UserDTO;
import com.printhub.model.User;
import com.printhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * UserService - Handles core identity logic and user-to-DTO transformations.
 * Centralizes authentication support and role-based data isolation.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTO registerUser(User user) {
        // In a real app, password encoding would happen here
        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::mapToDTO);
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
