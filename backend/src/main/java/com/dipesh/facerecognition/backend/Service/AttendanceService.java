package com.dipesh.facerecognition.backend.Service;

import com.dipesh.facerecognition.backend.Entities.Attendance;
import com.dipesh.facerecognition.backend.Entities.User;
import com.dipesh.facerecognition.backend.Repository.AttendanceRepo;
import com.dipesh.facerecognition.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final UserRepo userRepo;
    private final EmailService emailService;

    public void markAttendance(String email){
        User user = userRepo.findByEmail(email).orElseThrow(() ->  new RuntimeException("User not found"));
        Attendance attendance = new Attendance(null,user.getName(),email, LocalDate.now(), LocalTime.now());
        attendanceRepo.save(attendance);
        emailService.sendAttendanceEmail(user.getEmail(),user.getName(),attendance.getDate(),attendance.getTime());
    }

    public List<Attendance> getTodayRecords() {
        return attendanceRepo.findByDate(LocalDate.now());
    }
}
