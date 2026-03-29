package com.printhub.repository;

import com.printhub.model.SavedDesign;
import com.printhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedDesignRepository extends JpaRepository<SavedDesign, Long> {
    List<SavedDesign> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<SavedDesign> findByUserOrderByCreatedAtDesc(User user);
}
