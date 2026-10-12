package com.hotelbooking.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsDto {
    private long totalHotels;
    private long totalRooms;
    private long availableRooms;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
    private long registeredCustomers;
    private Map<String, Long> monthlyBookings;
    private Map<String, BigDecimal> monthlyRevenue;

    public DashboardStatsDto() {}

    public long getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(long totalHotels) {
        this.totalHotels = totalHotels;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getRegisteredCustomers() {
        return registeredCustomers;
    }

    public void setRegisteredCustomers(long registeredCustomers) {
        this.registeredCustomers = registeredCustomers;
    }

    public Map<String, Long> getMonthlyBookings() {
        return monthlyBookings;
    }

    public void setMonthlyBookings(Map<String, Long> monthlyBookings) {
        this.monthlyBookings = monthlyBookings;
    }

    public Map<String, BigDecimal> getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(Map<String, BigDecimal> monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }
}
