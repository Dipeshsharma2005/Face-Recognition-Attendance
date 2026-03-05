package com.dipesh.facerecognition.backend.Service;

import com.dipesh.facerecognition.backend.Entities.User;
import com.dipesh.facerecognition.backend.Repository.UserRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FaceService {

    private final UserRepo userRepo;
    private final AttendanceService attendanceService;
    private final RestTemplate restTemplate =new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String recognizeUser(MultipartFile image) throws IOException {
        String pythonUrl = "http://localhost:5001/recognize";
        List<User> users = userRepo.findAll();

        if (users.isEmpty()){
            return "No Registered User";
        }

        List<Map<String,Object>> usersData=new ArrayList<>();
        for (User user : users){
            List<Double> encoding = mapper.readValue(user.getFaceEncoding(),List.class);
            usersData.add(Map.of("email",user.getEmail(),"encoding",encoding));
        }
        String usersJson = mapper.writeValueAsString(usersData);
        File tempFile = File.createTempFile("face",".jpg");
        image.transferTo(tempFile);

        MultiValueMap<String,Object>body =  new LinkedMultiValueMap<>();
        body.add("file",new FileSystemResource(tempFile));
        body.add("users",usersJson);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl,new HttpEntity<>(body,headers),String.class);
        tempFile.delete();

        JsonNode json =  mapper.readTree(response.getBody());
        boolean recognized = json.has("recognized") && json.get("recognized").asBoolean();

        if (recognized) {
            // 2. Only get email if recognized is true
            String email = json.get("email").asText();
            attendanceService.markAttendance(email);
            return "✅ Attendance marked for " + email;
        } else {
            // 3. Handle failure cases (NO_MATCH or NO_FACE)
            String message = json.has("message") ? json.get("message").asText() : "Unknown error";
            return "❌ Face not recognized: " + message;
        }
    }
}
