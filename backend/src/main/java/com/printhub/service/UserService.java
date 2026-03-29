package com.printhub.service;

import com.printhub.dto.UserDTO;
import com.printhub.model.User;
import com.printhub.model.CustomerProfile;
import com.printhub.model.VendorProfile;
import com.printhub.repository.CustomerProfileRepository;
import com.printhub.repository.UserRepository;
import com.printhub.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * UserService - Handles core identity logic and user-to-DTO transformations.
 * Centralizes authentication support and role-based data isolation.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private VendorProfileRepository vendorProfileRepository;

    @Transactional
    public UserDTO setupCustomerProfile(Long userId, CustomerProfile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerProfile existingProfile = customerProfileRepository.findByUser(user).orElse(new CustomerProfile());
        existingProfile.setUser(user);
        existingProfile.setPhoneNumber(profile.getPhoneNumber());
        existingProfile.setAddress(profile.getAddress());
        existingProfile.setBio(profile.getBio());

        customerProfileRepository.save(existingProfile);

        user.setProfileComplete(true);
        userRepository.save(user);

        return mapToDTO(user);
    }

    @Transactional
    public UserDTO setupVendorProfile(Long userId, VendorProfile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VendorProfile existingProfile = vendorProfileRepository.findByUser(user).orElse(new VendorProfile());
        existingProfile.setUser(user);
        existingProfile.setBusinessName(profile.getBusinessName());
        existingProfile.setContact(profile.getContact());
        existingProfile.setLocation(profile.getLocation());
        existingProfile.setDescription(profile.getDescription());
        existingProfile.setMinQty(profile.getMinQty());
        existingProfile.setMaxQty(profile.getMaxQty());
        existingProfile.setPricePerUnit(profile.getPricePerUnit());
        existingProfile.setMaterials(profile.getMaterials());

        vendorProfileRepository.save(existingProfile);

        user.setProfileComplete(true);
        userRepository.save(user);

        return mapToDTO(user);
    }

    public UserDTO registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already in use.");
        }

        // Customers don't need additional profile setup
        if (user.getRole() == User.Role.CUSTOMER) {
            user.setProfileComplete(true);
        }

        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::mapToDTO);
    }

    public UserDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // For PROVIDER users, check actual vendor profile existence
        // This is more reliable than the boolean flag which can drift
        boolean isComplete = user.isProfileComplete();
        if (user.getRole() == User.Role.PROVIDER) {
            boolean hasVendorProfile = vendorProfileRepository.findByUser(user).isPresent();
            if (hasVendorProfile && !isComplete) {
                // Vendor profile exists but flag wasn't set - auto-heal
                user.setProfileComplete(true);
                userRepository.save(user);
                isComplete = true;
            }
        } else if (user.getRole() == User.Role.CUSTOMER) {
            // Customers are always complete
            isComplete = true;
            if (!user.isProfileComplete()) {
                user.setProfileComplete(true);
                userRepository.save(user);
            }
        }

        return mapToDTOWithComplete(user, isComplete);
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isProfileComplete());
    }

    private UserDTO mapToDTOWithComplete(User user, boolean isComplete) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), isComplete);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // Need to delete vendor profile first if it exists due to constraints
        User user = userRepository.findById(id).orElseThrow();
        if (user.getRole() == User.Role.PROVIDER) {
            vendorProfileRepository.findByUser(user).ifPresent(profile -> vendorProfileRepository.delete(profile));
        }
        userRepository.deleteById(id);
    }
}
