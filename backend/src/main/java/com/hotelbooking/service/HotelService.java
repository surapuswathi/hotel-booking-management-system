package com.hotelbooking.service;

import com.hotelbooking.dto.HotelRequest;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.User;
import com.hotelbooking.exception.ForbiddenException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findByActiveTrue();
    }

    public List<Hotel> getAllHotelsAdmin() {
        return hotelRepository.findAll();
    }

    public List<Hotel> getHotelsByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        return hotelRepository.findByOwner(owner);
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));
    }

    public List<Hotel> searchHotels(String city) {
        if (city == null || city.isBlank()) {
            return getAllHotels();
        }
        return hotelRepository.findByCityContainingIgnoreCaseAndActiveTrue(city);
    }

    @Transactional
    public Hotel createHotel(HotelRequest request, User currentUser) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setState(request.getState());
        hotel.setCountry(request.getCountry());
        hotel.setPhone(request.getPhone());
        hotel.setEmail(request.getEmail());
        hotel.setImageUrl(request.getImageUrl());
        if (request.getRating() != null) {
            hotel.setRating(request.getRating());
        }

        if (request.getOwnerId() != null && currentUser.getRole() == com.hotelbooking.entity.Role.ADMIN) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", request.getOwnerId()));
            hotel.setOwner(owner);
        } else {
            hotel.setOwner(currentUser);
        }

        return hotelRepository.save(hotel);
    }

    @Transactional
    public Hotel updateHotel(Long id, HotelRequest request, User currentUser) {
        Hotel hotel = getHotelById(id);

        if (currentUser.getRole() == com.hotelbooking.entity.Role.HOTEL_OWNER &&
                (hotel.getOwner() == null || !hotel.getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You are not authorized to update this hotel");
        }

        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setState(request.getState());
        hotel.setCountry(request.getCountry());
        hotel.setPhone(request.getPhone());
        hotel.setEmail(request.getEmail());
        if (request.getImageUrl() != null) {
            hotel.setImageUrl(request.getImageUrl());
        }
        if (request.getRating() != null) {
            hotel.setRating(request.getRating());
        }

        if (request.getOwnerId() != null && currentUser.getRole() == com.hotelbooking.entity.Role.ADMIN) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", request.getOwnerId()));
            hotel.setOwner(owner);
        }

        return hotelRepository.save(hotel);
    }

    @Transactional
    public void deleteHotel(Long id, User currentUser) {
        Hotel hotel = getHotelById(id);

        if (currentUser.getRole() == com.hotelbooking.entity.Role.HOTEL_OWNER &&
                (hotel.getOwner() == null || !hotel.getOwner().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("You are not authorized to delete this hotel");
        }

        hotel.setActive(false);
        hotelRepository.save(hotel);
    }
}
