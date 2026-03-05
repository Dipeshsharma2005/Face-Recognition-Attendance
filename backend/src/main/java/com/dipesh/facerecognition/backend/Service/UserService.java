package com.dipesh.facerecognition.backend.Service;

import com.dipesh.facerecognition.backend.Entities.User;
import com.dipesh.facerecognition.backend.Repository.UserRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public User registerUser(String name, String email, MultipartFile image) throws IOException {

        String pytonUrl = "http://localhost:5001/encode";

        File tempFile = File.createTempFile("face",".jpg");
        image.transferTo(tempFile);

        MultiValueMap<String,Object> body = new LinkedMultiValueMap<>();
        body.add("file",new FileSystemResource(tempFile));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String,Object>> requestEntity = new HttpEntity<>(body,headers);
        ResponseEntity<String> response = restTemplate.postForEntity(pytonUrl,requestEntity,String.class);
        tempFile.delete();

        JsonNode jsonNode = mapper.readTree(response.getBody());
        if (!jsonNode.get("success").asBoolean()) {
            throw new RuntimeException("No Face detected!");
        }

        String encoding=mapper.writeValueAsString(jsonNode.get("encoding"));
        User user = new User(null,name,email,encoding);
        return userRepo.save(user);
    }

    public List<User> findAll() {
        return userRepo.findAll();
    }
}
