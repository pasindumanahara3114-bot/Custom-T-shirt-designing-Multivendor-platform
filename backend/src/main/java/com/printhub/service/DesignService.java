package com.printhub.service;

import com.printhub.model.SavedDesign;
import com.printhub.model.User;
import com.printhub.repository.SavedDesignRepository;
import com.printhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignService {

    @Autowired
    private SavedDesignRepository designRepository;

    @Autowired
    private UserRepository userRepository;

    public SavedDesign saveDesign(Long userId, SavedDesign design) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        design.setUser(user);
        return designRepository.save(design);
    }

    public List<SavedDesign> getUserDesigns(Long userId) {
        return designRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<SavedDesign> getDesignById(Long id) {
        return designRepository.findById(id);
    }

    public void deleteDesign(Long id) {
        designRepository.deleteById(id);
    }
}
