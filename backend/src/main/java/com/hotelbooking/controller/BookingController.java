package com.hotelbooking.controller;

import com.hotelbooking.dto.ApiResponse;
import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.entity.Booking;
import com.hotelbooking.entity.User;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.security.UserPrincipal;
import com.hotelbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User customer = userRepository.findById(currentUser.getId()).orElseThrow();
        Booking booking = bookingService.createBooking(request, customer);
        return new ResponseEntity<>(ApiResponse.success("Booking created successfully", booking), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Booking> bookings = bookingService.getCustomerBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("My bookings fetched successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        Booking booking = bookingService.getBookingById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Booking details fetched successfully", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        Booking booking = bookingService.cancelBooking(id, user);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
