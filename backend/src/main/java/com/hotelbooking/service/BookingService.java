package com.hotelbooking.service;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.entity.*;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ForbiddenException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getAllBookingsAdmin() {
        return bookingRepository.findAll();
    }

    public List<Booking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByHotelOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Booking getBookingById(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (currentUser.getRole() == Role.CUSTOMER && !booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You cannot view this booking");
        }

        if (currentUser.getRole() == Role.HOTEL_OWNER &&
                (booking.getHotel().getOwner() == null || !booking.getHotel().getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You cannot view bookings for other hotels");
        }

        return booking;
    }

    public Booking getBookingByReference(String reference) {
        return bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "reference", reference));
    }

    @Transactional
    public Booking createBooking(BookingRequest request, User customer) {
        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        if (room.getStatus() == RoomStatus.MAINTENANCE || room.getStatus() == RoomStatus.INACTIVE) {
            throw new BadRequestException("Room is not available for booking");
        }

        if (request.getNumberOfGuests() > room.getCapacity()) {
            throw new BadRequestException("Number of guests (" + request.getNumberOfGuests() + 
                    ") exceeds room capacity (" + room.getCapacity() + ")");
        }

        // BACKEND AVAILABILITY & DOUBLE BOOKING PREVENTION LOGIC
        long overlapping = bookingRepository.countOverlappingBookings(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());

        if (overlapping > 0) {
            throw new BadRequestException("Room " + room.getRoomNumber() + 
                    " is not available for the requested dates (" + 
                    request.getCheckInDate() + " to " + request.getCheckOutDate() + ").");
        }

        long numberOfNights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        int roomsCount = request.getNumberOfRooms() != null ? request.getNumberOfRooms() : 1;

        BigDecimal subtotal = room.getPrice()
                .multiply(BigDecimal.valueOf(numberOfNights))
                .multiply(BigDecimal.valueOf(roomsCount));

        // Add 12% tax
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(tax).setScale(2, RoundingMode.HALF_UP);

        Booking booking = new Booking();
        booking.setBookingReference("HB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCustomer(customer);
        booking.setHotel(room.getHotel());
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setNumberOfRooms(roomsCount);
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (currentUser.getRole() == Role.CUSTOMER && !booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You cannot cancel this booking");
        }

        if (currentUser.getRole() == Role.HOTEL_OWNER &&
                (booking.getHotel().getOwner() == null || !booking.getHotel().getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You cannot cancel bookings for other hotels");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        booking.setBookingStatus(status);
        return bookingRepository.save(booking);
    }
}
