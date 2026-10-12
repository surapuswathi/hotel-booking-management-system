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
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomTypeService roomTypeService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserRepository userRepository;

    // DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = reportService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard stats fetched", stats));
    }

    // HOTELS
    @GetMapping("/hotels")
    public ResponseEntity<ApiResponse<List<Hotel>>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotelsAdmin();
        return ResponseEntity.ok(ApiResponse.success("Hotels fetched", hotels));
    }

    @PostMapping("/hotels")
    public ResponseEntity<ApiResponse<Hotel>> createHotel(
            @Valid @RequestBody HotelRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        Hotel hotel = hotelService.createHotel(request, admin);
        return new ResponseEntity<>(ApiResponse.success("Hotel created", hotel), HttpStatus.CREATED);
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<ApiResponse<Hotel>> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        Hotel hotel = hotelService.updateHotel(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success("Hotel updated", hotel));
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        hotelService.deleteHotel(id, admin);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted/deactivated"));
    }

    // ROOMS
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<Room>> createRoom(
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        Room room = roomService.createRoom(request, admin);
        return new ResponseEntity<>(ApiResponse.success("Room created", room), HttpStatus.CREATED);
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Room>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        Room room = roomService.updateRoom(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success("Room updated", room));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User admin = userRepository.findById(currentUser.getId()).orElseThrow();
        roomService.deleteRoom(id, admin);
        return ResponseEntity.ok(ApiResponse.success("Room deactivated"));
    }

    // ROOM TYPES
    @PostMapping("/room-types")
    public ResponseEntity<ApiResponse<RoomTypeDto>> createRoomType(@Valid @RequestBody RoomTypeDto dto) {
        RoomTypeDto saved = roomTypeService.createRoomType(dto);
        return new ResponseEntity<>(ApiResponse.success("Room type created", saved), HttpStatus.CREATED);
    }

    @PutMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> updateRoomType(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeDto dto) {

        RoomTypeDto updated = roomTypeService.updateRoomType(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Room type updated", updated));
    }

    @DeleteMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.ok(ApiResponse.success("Room type deleted"));
    }

    // BOOKINGS
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookingsAdmin();
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched", bookings));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {

        Booking updated = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", updated));
    }

    // USERS
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        UserDto user = userService.toggleUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }

    // REPORTS
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<ReportDataDto>> getReports() {
        ReportDataDto report = reportService.getAdminReportData();
        return ResponseEntity.ok(ApiResponse.success("Reports generated", report));
    }
}
