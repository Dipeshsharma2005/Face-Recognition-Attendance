package com.dipesh.facerecognition.backend.Repository;

import com.dipesh.facerecognition.backend.Entities.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance,Long> {
    List<Attendance> findByDate(LocalDate date);
}
