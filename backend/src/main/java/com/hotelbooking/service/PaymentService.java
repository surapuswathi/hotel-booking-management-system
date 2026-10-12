package com.hotelbooking.service;

import com.hotelbooking.dto.PaymentRequest;
import com.hotelbooking.entity.*;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for booking", "id", bookingId));
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }

    @Transactional
    public Payment processPayment(PaymentRequest request, User currentUser) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        if (!booking.getCustomer().getId().equals(currentUser.getId()) && currentUser.getRole() == Role.CUSTOMER) {
            throw new BadRequestException("You can only make payment for your own booking");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled booking");
        }

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED || booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Booking is already paid and confirmed");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(new Payment());
        payment.setBooking(booking);
        payment.setAmount(request.getAmount() != null ? request.getAmount() : booking.getTotalAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status to CONFIRMED
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return savedPayment;
    }
}
