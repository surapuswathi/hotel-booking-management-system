package com.hotelbooking.controller;

import com.hotelbooking.dto.ApiResponse;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hotel>>> getAllHotels(@RequestParam(required = false) String city) {
        List<Hotel> hotels;
        if (city != null && !city.isBlank()) {
            hotels = hotelService.searchHotels(city);
        } else {
            hotels = hotelService.getAllHotels();
        }
        return ResponseEntity.ok(ApiResponse.success("Hotels fetched successfully", hotels));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hotel>> getHotelById(@PathVariable Long id) {
        Hotel hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel details fetched successfully", hotel));
    }
}
