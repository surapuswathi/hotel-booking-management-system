package com.hotelbooking.dto;

import com.hotelbooking.entity.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RoomTypeDto {
    private Long id;

    @NotBlank(message = "Room type name is required")
    private String name;

    private String description;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Base price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal basePrice;

    public RoomTypeDto() {}

    public RoomTypeDto(RoomType roomType) {
        this.id = roomType.getId();
        this.name = roomType.getName();
        this.description = roomType.getDescription();
        this.capacity = roomType.getCapacity();
        this.basePrice = roomType.getBasePrice();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }
}
