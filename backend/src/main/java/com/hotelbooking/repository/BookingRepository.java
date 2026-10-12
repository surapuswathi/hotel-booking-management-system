package com.hotelbooking.repository;

import com.hotelbooking.entity.Booking;
import com.hotelbooking.entity.BookingStatus;
import com.hotelbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByHotelOwnerIdOrderByCreatedAtDesc(Long ownerId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.bookingStatus IN (com.hotelbooking.entity.BookingStatus.PENDING, com.hotelbooking.entity.BookingStatus.CONFIRMED) " +
           "AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    long countOverlappingBookings(@Param("roomId") Long roomId,
                                  @Param("checkInDate") LocalDate checkInDate,
                                  @Param("checkOutDate") LocalDate checkOutDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.id <> :excludeBookingId " +
           "AND b.bookingStatus IN (com.hotelbooking.entity.BookingStatus.PENDING, com.hotelbooking.entity.BookingStatus.CONFIRMED) " +
           "AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    long countOverlappingBookingsExcludingSelf(@Param("roomId") Long roomId,
                                               @Param("checkInDate") LocalDate checkInDate,
                                               @Param("checkOutDate") LocalDate checkOutDate,
                                               @Param("excludeBookingId") Long excludeBookingId);

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = com.hotelbooking.entity.BookingStatus.CONFIRMED OR b.bookingStatus = com.hotelbooking.entity.BookingStatus.COMPLETED")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.hotel.owner.id = :ownerId AND (b.bookingStatus = com.hotelbooking.entity.BookingStatus.CONFIRMED OR b.bookingStatus = com.hotelbooking.entity.BookingStatus.COMPLETED)")
    BigDecimal calculateOwnerRevenue(@Param("ownerId") Long ownerId);
}
