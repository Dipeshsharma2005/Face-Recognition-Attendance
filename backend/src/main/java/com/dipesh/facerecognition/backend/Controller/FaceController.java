package com.dipesh.facerecognition.backend.Controller;

import com.dipesh.facerecognition.backend.Service.FaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/face")
@RequiredArgsConstructor
public class FaceController {
    private final FaceService faceService;

    @PostMapping("/recognize")
    public ResponseEntity<?> recognize(@RequestParam MultipartFile image) throws IOException {
        String message = faceService.recognizeUser(image);
        return ResponseEntity.ok(Map.of("message",message));
    }
}
