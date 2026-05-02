package com.shrimpfarm.backend.controller;


import com.shrimpfarm.backend.Entity.Pond;
import com.shrimpfarm.backend.Entity.User;
import com.shrimpfarm.backend.dto.UpdateUserDTO;
import com.shrimpfarm.backend.service.PondService;
import com.shrimpfarm.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // GET /api/ponds/1
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
