package com.dipesh.facerecognition.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAttendanceEmail(String to, String name, LocalDate date , LocalTime time){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Attendance Marked Successfully ✅");
            message.setText(String.format("Hello %s,\n\nYour attendance has been successfully marked on %s at %s.\n\nBest regards,\nFace Recognition System",name,date,time));
            mailSender.send(message);
        }catch (Exception e){
            System.out.println("⚠️ Failed to send email: " + e.getMessage());
        }
    }
}
