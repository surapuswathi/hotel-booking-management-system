package com.hotelbooking.controller;

import com.hotelbooking.dto.*;
import com.hotelbooking.entity.*;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.security.UserPrincipal;
import com.hotelbooking.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getOwnerDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        DashboardStatsDto stats = reportService.getOwnerDashboardStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Owner dashboard stats fetched", stats));
    }

    @GetMapping("/hotels")
    public ResponseEntity<ApiResponse<List<Hotel>>> getOwnerHotels(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<Hotel> hotels = hotelService.getHotelsByOwner(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Owner hotels fetched", hotels));
    }

    @PostMapping("/hotels")
    public ResponseEntity<ApiResponse<Hotel>> createHotel(
            @Valid @RequestBody HotelRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();
        request.setOwnerId(owner.getId());
        Hotel hotel = hotelService.createHotel(request, owner);
        return new ResponseEntity<>(ApiResponse.success("Hotel created", hotel), HttpStatus.CREATED);
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<ApiResponse<Hotel>> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();
        Hotel hotel = hotelService.updateHotel(id, request, owner);
        return ResponseEntity.ok(ApiResponse.success("Hotel updated", hotel));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<Room>> createRoom(
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();
        Room room = roomService.createRoom(request, owner);
        return new ResponseEntity<>(ApiResponse.success("Room created", room), HttpStatus.CREATED);
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Room>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();
        Room room = roomService.updateRoom(id, request, owner);
        return ResponseEntity.ok(ApiResponse.success("Room updated", room));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();
        roomService.deleteRoom(id, owner);
        return ResponseEntity.ok(ApiResponse.success("Room deactivated"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getOwnerBookings(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<Booking> bookings = bookingService.getOwnerBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Owner bookings fetched", bookings));
    }
}
