package com.hotelbooking.service;

import com.hotelbooking.dto.RoomRequest;
import com.hotelbooking.entity.*;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ForbiddenException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public List<Room> getAvailableRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelIdAndStatus(hotelId, RoomStatus.AVAILABLE);
    }

    public List<Room> getAvailableRoomsForDates(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        if (checkInDate == null || checkOutDate == null) {
            return rooms.stream()
                    .filter(r -> r.getStatus() == RoomStatus.AVAILABLE)
                    .collect(Collectors.toList());
        }

        return rooms.stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE || room.getStatus() == RoomStatus.OCCUPIED)
                .filter(room -> {
                    long count = bookingRepository.countOverlappingBookings(room.getId(), checkInDate, checkOutDate);
                    return count == 0;
                })
                .collect(Collectors.toList());
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    @Transactional
    public Room createRoom(RoomRequest request, User currentUser) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", request.getHotelId()));

        if (currentUser.getRole() == Role.HOTEL_OWNER &&
                (hotel.getOwner() == null || !hotel.getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You can only add rooms to your own hotels");
        }

        roomRepository.findByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber())
                .ifPresent(r -> {
                    throw new BadRequestException("Room number " + request.getRoomNumber() + " already exists in this hotel");
                });

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", request.getRoomTypeId()));

        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setHotel(hotel);
        room.setRoomType(roomType);
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setStatus(request.getStatus() != null ? request.getStatus() : RoomStatus.AVAILABLE);
        room.setDescription(request.getDescription());
        room.setImageUrl(request.getImageUrl());

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, RoomRequest request, User currentUser) {
        Room room = getRoomById(id);
        Hotel hotel = room.getHotel();

        if (currentUser.getRole() == Role.HOTEL_OWNER &&
                (hotel.getOwner() == null || !hotel.getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You can only update rooms in your own hotels");
        }

        if (!room.getRoomNumber().equals(request.getRoomNumber())) {
            roomRepository.findByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber())
                    .ifPresent(r -> {
                        throw new BadRequestException("Room number " + request.getRoomNumber() + " already exists in this hotel");
                    });
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", request.getRoomTypeId()));

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(roomType);
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            room.setStatus(request.getStatus());
        }
        room.setDescription(request.getDescription());
        if (request.getImageUrl() != null) {
            room.setImageUrl(request.getImageUrl());
        }

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id, User currentUser) {
        Room room = getRoomById(id);
        Hotel hotel = room.getHotel();

        if (currentUser.getRole() == Role.HOTEL_OWNER &&
                (hotel.getOwner() == null || !hotel.getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You can only delete rooms in your own hotels");
        }

        room.setStatus(RoomStatus.INACTIVE);
        roomRepository.save(room);
    }
}
