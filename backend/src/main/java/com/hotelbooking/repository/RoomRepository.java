package com.hotelbooking.repository;

import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.Room;
import com.hotelbooking.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);
    List<Room> findByHotelIdAndStatus(Long hotelId, RoomStatus status);
    Optional<Room> findByHotelIdAndRoomNumber(Long hotelId, String roomNumber);
    long countByStatus(RoomStatus status);
    List<Room> findByHotelOwner(com.hotelbooking.entity.User owner);
}
