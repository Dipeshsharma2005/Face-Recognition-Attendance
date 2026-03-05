package com.dipesh.facerecognition.backend.Controller;

import com.dipesh.facerecognition.backend.Entities.Attendance;
import com.dipesh.facerecognition.backend.Service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping("/today")
    public List<Attendance> getTodayRecods(){
        return attendanceService.getTodayRecords();
    }
}
