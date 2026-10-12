package com.hotelbooking.repository;

import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {
    List<Hotel> findByOwner(User owner);
    List<Hotel> findByActiveTrue();
    List<Hotel> findByCityContainingIgnoreCaseAndActiveTrue(String city);
}
