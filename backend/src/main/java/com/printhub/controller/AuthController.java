/**
 * AuthController - Manages user authentication and identity operations.
 * Provides endpoints for account registration and user profile retrieval.
 */
package com.printhub.controller;

import com.printhub.dto.UserDTO;
import com.printhub.model.User;
import com.printhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Registers a new user with a specific role (Customer, Provider, Admin).
     * 
     * @param user The user entity containing registration details.
     * @return Transformed UserDTO containing public identity info.
     */
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody User user) {
        return ResponseEntity.ok(userService.login(user.getEmail(), user.getPassword()));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
