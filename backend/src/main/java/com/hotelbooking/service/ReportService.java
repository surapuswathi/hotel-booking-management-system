package com.hotelbooking.service;

import com.hotelbooking.dto.DashboardStatsDto;
import com.hotelbooking.dto.ReportDataDto;
import com.hotelbooking.entity.*;
import com.hotelbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardStatsDto getAdminDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalHotels(hotelRepository.count());
        stats.setTotalRooms(roomRepository.count());
        stats.setAvailableRooms(roomRepository.countByStatus(RoomStatus.AVAILABLE));

        stats.setTotalBookings(bookingRepository.count());
        stats.setConfirmedBookings(bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED));
        stats.setCancelledBookings(bookingRepository.countByBookingStatus(BookingStatus.CANCELLED));

        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        stats.setRegisteredCustomers(userRepository.findByRole(Role.CUSTOMER).size());

        List<Booking> bookings = bookingRepository.findAll();
        Map<String, Long> monthlyBookings = new LinkedHashMap<>();
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();

        for (Booking b : bookings) {
            String month = b.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyBookings.put(month, monthlyBookings.getOrDefault(month, 0L) + 1);

            if (b.getBookingStatus() == BookingStatus.CONFIRMED || b.getBookingStatus() == BookingStatus.COMPLETED) {
                BigDecimal currentRev = monthlyRevenue.getOrDefault(month, BigDecimal.ZERO);
                monthlyRevenue.put(month, currentRev.add(b.getTotalAmount()));
            }
        }

        stats.setMonthlyBookings(monthlyBookings);
        stats.setMonthlyRevenue(monthlyRevenue);

        return stats;
    }

    public DashboardStatsDto getOwnerDashboardStats(Long ownerId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        User owner = userRepository.findById(ownerId).orElse(null);
        if (owner == null) return stats;

        List<Hotel> ownerHotels = hotelRepository.findByOwner(owner);
        stats.setTotalHotels(ownerHotels.size());

        List<Room> ownerRooms = roomRepository.findByHotelOwner(owner);
        stats.setTotalRooms(ownerRooms.size());
        stats.setAvailableRooms(ownerRooms.stream().filter(r -> r.getStatus() == RoomStatus.AVAILABLE).count());

        List<Booking> ownerBookings = bookingRepository.findByHotelOwnerIdOrderByCreatedAtDesc(ownerId);
        stats.setTotalBookings(ownerBookings.size());
        stats.setConfirmedBookings(ownerBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count());
        stats.setCancelledBookings(ownerBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED).count());

        BigDecimal ownerRev = bookingRepository.calculateOwnerRevenue(ownerId);
        stats.setTotalRevenue(ownerRev != null ? ownerRev : BigDecimal.ZERO);

        Map<String, Long> monthlyBookings = new LinkedHashMap<>();
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();

        for (Booking b : ownerBookings) {
            String month = b.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyBookings.put(month, monthlyBookings.getOrDefault(month, 0L) + 1);

            if (b.getBookingStatus() == BookingStatus.CONFIRMED || b.getBookingStatus() == BookingStatus.COMPLETED) {
                BigDecimal currentRev = monthlyRevenue.getOrDefault(month, BigDecimal.ZERO);
                monthlyRevenue.put(month, currentRev.add(b.getTotalAmount()));
            }
        }

        stats.setMonthlyBookings(monthlyBookings);
        stats.setMonthlyRevenue(monthlyRevenue);

        return stats;
    }

    public ReportDataDto getAdminReportData() {
        ReportDataDto report = new ReportDataDto();

        List<Booking> bookings = bookingRepository.findAll();
        report.setTotalBookings(bookings.size());
        report.setConfirmedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count());
        report.setCancelledBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED).count());
        report.setCompletedBookings(bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.COMPLETED).count());

        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        report.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // Calculate most booked hotel
        Map<String, Long> hotelBookingsCount = bookings.stream()
                .collect(Collectors.groupingBy(b -> b.getHotel().getName(), Collectors.counting()));
        String mostBooked = hotelBookingsCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
        report.setMostBookedHotel(mostBooked);

        // Calculate most popular room type
        Map<String, Long> roomTypeCount = bookings.stream()
                .filter(b -> b.getRoom() != null && b.getRoom().getRoomType() != null)
                .collect(Collectors.groupingBy(b -> b.getRoom().getRoomType().getName(), Collectors.counting()));
        String mostPopularType = roomTypeCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
        report.setMostPopularRoomType(mostPopularType);

        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("PENDING", bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.PENDING).count());
        statusMap.put("CONFIRMED", report.getConfirmedBookings());
        statusMap.put("CANCELLED", report.getCancelledBookings());
        statusMap.put("COMPLETED", report.getCompletedBookings());
        report.setBookingsByStatus(statusMap);

        // Hotel performance
        List<Map<String, Object>> performanceList = new ArrayList<>();
        List<Hotel> hotels = hotelRepository.findAll();
        for (Hotel h : hotels) {
            long count = bookings.stream().filter(b -> b.getHotel().getId().equals(h.getId())).count();
            BigDecimal rev = bookings.stream()
                    .filter(b -> b.getHotel().getId().equals(h.getId()))
                    .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED || b.getBookingStatus() == BookingStatus.COMPLETED)
                    .map(Booking::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> map = new HashMap<>();
            map.put("hotelId", h.getId());
            map.put("hotelName", h.getName());
            map.put("city", h.getCity());
            map.put("totalBookings", count);
            map.put("revenue", rev);
            performanceList.add(map);
        }
        report.setHotelPerformance(performanceList);

        return report;
    }
}
