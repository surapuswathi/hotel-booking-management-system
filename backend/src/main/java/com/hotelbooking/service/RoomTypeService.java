package com.hotelbooking.service;

import com.hotelbooking.dto.RoomTypeDto;
import com.hotelbooking.entity.RoomType;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    public List<RoomTypeDto> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(RoomTypeDto::new)
                .collect(Collectors.toList());
    }

    public RoomTypeDto getRoomTypeById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", id));
        return new RoomTypeDto(roomType);
    }

    @Transactional
    public RoomTypeDto createRoomType(RoomTypeDto dto) {
        if (roomTypeRepository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new BadRequestException("Room type already exists: " + dto.getName());
        }

        RoomType roomType = new RoomType();
        roomType.setName(dto.getName());
        roomType.setDescription(dto.getDescription());
        roomType.setCapacity(dto.getCapacity());
        roomType.setBasePrice(dto.getBasePrice());

        RoomType saved = roomTypeRepository.save(roomType);
        return new RoomTypeDto(saved);
    }

    @Transactional
    public RoomTypeDto updateRoomType(Long id, RoomTypeDto dto) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", id));

        roomTypeRepository.findByNameIgnoreCase(dto.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Room type already exists with name: " + dto.getName());
            }
        });

        roomType.setName(dto.getName());
        roomType.setDescription(dto.getDescription());
        roomType.setCapacity(dto.getCapacity());
        roomType.setBasePrice(dto.getBasePrice());

        RoomType updated = roomTypeRepository.save(roomType);
        return new RoomTypeDto(updated);
    }

    @Transactional
    public void deleteRoomType(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType", "id", id));
        roomTypeRepository.delete(roomType);
    }
}
