package com.hotelbooking.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ReportDataDto {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private String mostBookedHotel;
    private String mostPopularRoomType;
    private Map<String, BigDecimal> revenueByMonth;
    private Map<String, Long> bookingsByStatus;
    private List<Map<String, Object>> hotelPerformance;

    public ReportDataDto() {}

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
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

    public long getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(long completedBookings) {
        this.completedBookings = completedBookings;
    }

    public String getMostBookedHotel() {
        return mostBookedHotel;
    }

    public void setMostBookedHotel(String mostBookedHotel) {
        this.mostBookedHotel = mostBookedHotel;
    }

    public String getMostPopularRoomType() {
        return mostPopularRoomType;
    }

    public void setMostPopularRoomType(String mostPopularRoomType) {
        this.mostPopularRoomType = mostPopularRoomType;
    }

    public Map<String, BigDecimal> getRevenueByMonth() {
        return revenueByMonth;
    }

    public void setRevenueByMonth(Map<String, BigDecimal> revenueByMonth) {
        this.revenueByMonth = revenueByMonth;
    }

    public Map<String, Long> getBookingsByStatus() {
        return bookingsByStatus;
    }

    public void setBookingsByStatus(Map<String, Long> bookingsByStatus) {
        this.bookingsByStatus = bookingsByStatus;
    }

    public List<Map<String, Object>> getHotelPerformance() {
        return hotelPerformance;
    }

    public void setHotelPerformance(List<Map<String, Object>> hotelPerformance) {
        this.hotelPerformance = hotelPerformance;
    }
}
