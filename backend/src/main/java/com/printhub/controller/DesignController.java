package com.printhub.controller;

import com.printhub.model.SavedDesign;
import com.printhub.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designs")
@CrossOrigin(origins = "http://localhost:5173")
public class DesignController {

    @Autowired
    private DesignService designService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<SavedDesign> saveDesign(@PathVariable Long userId, @RequestBody SavedDesign design) {
        return ResponseEntity.ok(designService.saveDesign(userId, design));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedDesign>> getUserDesigns(@PathVariable Long userId) {
        return ResponseEntity.ok(designService.getUserDesigns(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedDesign> getDesignById(@PathVariable Long id) {
        return designService.getDesignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(@PathVariable Long id) {
        designService.deleteDesign(id);
        return ResponseEntity.ok().build();
    }
}
