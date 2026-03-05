package com.dipesh.facerecognition.backend.Controller;

import com.dipesh.facerecognition.backend.Entities.User;
import com.dipesh.facerecognition.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> register(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("image") MultipartFile image
    ) {
        try {
            User user = userService.registerUser(name, email, image);
            return ResponseEntity.ok(
                    Map.of("message", "User registered successfully", "user", user)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<User> findAll() {
        return userService.findAll();
    }
}
