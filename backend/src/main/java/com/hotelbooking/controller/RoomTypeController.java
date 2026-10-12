package com.hotelbooking.controller;

import com.hotelbooking.dto.ApiResponse;
import com.hotelbooking.dto.RoomTypeDto;
import com.hotelbooking.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomTypeDto>>> getAllRoomTypes() {
        List<RoomTypeDto> roomTypes = roomTypeService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.success("Room types fetched successfully", roomTypes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> getRoomTypeById(@PathVariable Long id) {
        RoomTypeDto roomType = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.success("Room type fetched successfully", roomType));
    }
}
