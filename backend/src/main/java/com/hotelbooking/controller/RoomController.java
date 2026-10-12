package com.hotelbooking.controller;

import com.hotelbooking.dto.ApiResponse;
import com.hotelbooking.entity.Room;
import com.hotelbooking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/api/hotels/{hotelId}/rooms")
    public ResponseEntity<ApiResponse<List<Room>>> getRoomsByHotel(
            @PathVariable Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        List<Room> rooms = roomService.getAvailableRoomsForDates(hotelId, checkInDate, checkOutDate);
        return ResponseEntity.ok(ApiResponse.success("Rooms fetched successfully", rooms));
    }

    @GetMapping("/api/rooms/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success("Room details fetched successfully", room));
    }
}
