package com.shrimpfarm.backend.controller;

import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.dto.PondDTO;
import com.shrimpfarm.backend.service.PondService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ponds")
@RequiredArgsConstructor
public class PondController {

    private final PondService pondService;

    // GET /api/ponds?userId=1
    @GetMapping
    public ResponseEntity<List<Pond>> getPonds(@RequestParam Long userId) {
        return ResponseEntity.ok(pondService.getPondsByUser(userId));
    }

    // GET /api/ponds/1
    @GetMapping("/{id}")
    public ResponseEntity<Pond> getPond(@PathVariable Long id) {
        return ResponseEntity.ok(pondService.getPondById(id));
    }

    // POST /api/ponds
    @PostMapping
    public ResponseEntity<Pond> createPond(@RequestBody PondDTO dto) {
        return ResponseEntity.ok(pondService.createPond(dto));
    }

    // PUT /api/ponds/1
    @PutMapping("/{id}")
    public ResponseEntity<Pond> updatePond(@PathVariable Long id,
                                           @RequestBody PondDTO dto) {
        return ResponseEntity.ok(pondService.updatePond(id, dto));
    }

    // DELETE /api/ponds/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePond(@PathVariable Long id) {
        pondService.deletePond(id);
        return ResponseEntity.noContent().build();
    }
}