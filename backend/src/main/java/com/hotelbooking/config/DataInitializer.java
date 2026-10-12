package com.hotelbooking.config;

import com.hotelbooking.entity.*;
import com.hotelbooking.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Sample data already initialized.");
            return;
        }

        logger.info("Initializing sample database records...");

        // 1. Seed Users
        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail("admin@hotel.com");
        admin.setPhone("+1234567890");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);

        User owner1 = new User();
        owner1.setFullName("Alexander Wright");
        owner1.setEmail("owner@hotel.com");
        owner1.setPhone("+1987654321");
        owner1.setPassword(passwordEncoder.encode("Owner@123"));
        owner1.setRole(Role.HOTEL_OWNER);
        owner1.setActive(true);

        User owner2 = new User();
        owner2.setFullName("Sophia Martinez");
        owner2.setEmail("sophia.owner@hotel.com");
        owner2.setPhone("+1987654322");
        owner2.setPassword(passwordEncoder.encode("Owner@123"));
        owner2.setRole(Role.HOTEL_OWNER);
        owner2.setActive(true);

        User customer1 = new User();
        customer1.setFullName("John Doe");
        customer1.setEmail("customer@hotel.com");
        customer1.setPhone("+1555019283");
        customer1.setPassword(passwordEncoder.encode("Customer@123"));
        customer1.setRole(Role.CUSTOMER);
        customer1.setActive(true);

        User customer2 = new User();
        customer2.setFullName("Emma Watson");
        customer2.setEmail("emma.watson@gmail.com");
        customer2.setPhone("+1555019284");
        customer2.setPassword(passwordEncoder.encode("Customer@123"));
        customer2.setRole(Role.CUSTOMER);
        customer2.setActive(true);

        userRepository.saveAll(List.of(admin, owner1, owner2, customer1, customer2));

        // 2. Seed Room Types
        RoomType single = roomTypeRepository.save(new RoomType(null, "Single", "Cozy room for solo travelers with single bed & workspace.", 1, new BigDecimal("80.00")));
        RoomType doubleType = roomTypeRepository.save(new RoomType(null, "Double", "Spacious room with a comfortable queen-size bed for two.", 2, new BigDecimal("120.00")));
        RoomType deluxe = roomTypeRepository.save(new RoomType(null, "Deluxe", "Premium room with king bed, scenic view, and marble bath.", 2, new BigDecimal("200.00")));
        RoomType suite = roomTypeRepository.save(new RoomType(null, "Suite", "Luxury suite with private lounge, kitchenette, and king bed.", 3, new BigDecimal("350.00")));
        RoomType family = roomTypeRepository.save(new RoomType(null, "Family", "Large family suite with two queen beds and dining nook.", 4, new BigDecimal("280.00")));

        // 3. Seed 5+ Hotels
        Hotel h1 = new Hotel();
        h1.setName("Grand Palace Resort & Spa");
        h1.setDescription("5-star luxury beachfront resort with private ocean access, infinity pool, spa, and fine dining.");
        h1.setAddress("100 Ocean Drive");
        h1.setCity("Miami");
        h1.setState("Florida");
        h1.setCountry("USA");
        h1.setPhone("+13055550100");
        h1.setEmail("reservations@grandpalacemiami.com");
        h1.setOwner(owner1);
        h1.setImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80");
        h1.setRating(4.9);

        Hotel h2 = new Hotel();
        h2.setName("The Ritz Manhattan");
        h2.setDescription("Elegant high-rise hotel in the heart of Midtown Manhattan with spectacular skyline views.");
        h2.setAddress("750 Fifth Avenue");
        h2.setCity("New York");
        h2.setState("New York");
        h2.setCountry("USA");
        h2.setPhone("+12125550200");
        h2.setEmail("info@ritzmanhattan.com");
        h2.setOwner(owner1);
        h2.setImageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80");
        h2.setRating(4.8);

        Hotel h3 = new Hotel();
        h3.setName("Alpine Haven Lodge");
        h3.setDescription("Cozy mountain retreat offering ski-in/ski-out access, fireplaces, heated pools, and alpine dining.");
        h3.setAddress("450 Mountain Pass Road");
        h3.setCity("Aspen");
        h3.setState("Colorado");
        h3.setCountry("USA");
        h3.setPhone("+19705550300");
        h3.setEmail("stay@alpinehavenaspen.com");
        h3.setOwner(owner2);
        h3.setImageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80");
        h3.setRating(4.7);

        Hotel h4 = new Hotel();
        h4.setName("San Francisco Bayfront Hotel");
        h4.setDescription("Modern waterfront property featuring views of Golden Gate Bridge and Fisherman's Wharf access.");
        h4.setAddress("200 Embarcadero Boulevard");
        h4.setCity("San Francisco");
        h4.setState("California");
        h4.setCountry("USA");
        h4.setPhone("+14155550400");
        h4.setEmail("contact@sfbayfronthotel.com");
        h4.setOwner(owner2);
        h4.setImageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80");
        h4.setRating(4.6);

        Hotel h5 = new Hotel();
        h5.setName("Desert Oasis Resort");
        h5.setDescription("Tranquil desert sanctuary with private villas, thermal pools, golf course, and starlit dining.");
        h5.setAddress("88 Desert Palm Way");
        h5.setCity("Scottsdale");
        h5.setState("Arizona");
        h5.setCountry("USA");
        h5.setPhone("+14805550500");
        h5.setEmail("welcome@desertoasisresort.com");
        h5.setOwner(owner1);
        h5.setImageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80");
        h5.setRating(4.9);

        hotelRepository.saveAll(List.of(h1, h2, h3, h4, h5));

        // 4. Seed 15+ Rooms
        List<Room> rooms = new ArrayList<>();

        // Grand Palace Rooms
        rooms.add(createRoom("101", h1, single, new BigDecimal("90.00"), 1, RoomStatus.AVAILABLE, "Cozy ocean-side room", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("102", h1, doubleType, new BigDecimal("130.00"), 2, RoomStatus.AVAILABLE, "Deluxe double with balcony", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("201", h1, deluxe, new BigDecimal("220.00"), 2, RoomStatus.AVAILABLE, "Ocean view deluxe king suite", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("301", h1, suite, new BigDecimal("380.00"), 3, RoomStatus.AVAILABLE, "Penthouse executive suite", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"));

        // Ritz Manhattan Rooms
        rooms.add(createRoom("1201", h2, single, new BigDecimal("110.00"), 1, RoomStatus.AVAILABLE, "Urban solo room with city view", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("1202", h2, doubleType, new BigDecimal("160.00"), 2, RoomStatus.AVAILABLE, "Midtown classic double room", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("1401", h2, deluxe, new BigDecimal("250.00"), 2, RoomStatus.AVAILABLE, "Skyline view deluxe suite", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("1501", h2, suite, new BigDecimal("420.00"), 3, RoomStatus.AVAILABLE, "Fifth Avenue presidential suite", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"));

        // Alpine Haven Rooms
        rooms.add(createRoom("10", h3, doubleType, new BigDecimal("140.00"), 2, RoomStatus.AVAILABLE, "Mountain chalet double room", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("12", h3, family, new BigDecimal("300.00"), 4, RoomStatus.AVAILABLE, "Alpine family lodge room", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("20", h3, suite, new BigDecimal("390.00"), 3, RoomStatus.AVAILABLE, "Fireplace luxury suite", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"));

        // San Francisco Bayfront Rooms
        rooms.add(createRoom("304", h4, single, new BigDecimal("95.00"), 1, RoomStatus.AVAILABLE, "Modern Bayfront solo room", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("305", h4, doubleType, new BigDecimal("145.00"), 2, RoomStatus.AVAILABLE, "Harbor view double room", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("405", h4, family, new BigDecimal("310.00"), 4, RoomStatus.AVAILABLE, "Bayfront family suite", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"));

        // Desert Oasis Rooms
        rooms.add(createRoom("V-01", h5, deluxe, new BigDecimal("260.00"), 2, RoomStatus.AVAILABLE, "Private desert pool villa", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"));
        rooms.add(createRoom("V-02", h5, suite, new BigDecimal("450.00"), 3, RoomStatus.AVAILABLE, "Grand desert sanctuary suite", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"));

        roomRepository.saveAll(rooms);

        // 5. Seed Sample Bookings & Payments
        Booking b1 = new Booking();
        b1.setBookingReference("HB-SAMPLE01");
        b1.setCustomer(customer1);
        b1.setHotel(h1);
        b1.setRoom(rooms.get(2)); // Deluxe
        b1.setCheckInDate(LocalDate.now().plusDays(5));
        b1.setCheckOutDate(LocalDate.now().plusDays(8));
        b1.setNumberOfGuests(2);
        b1.setNumberOfRooms(1);
        b1.setTotalAmount(new BigDecimal("739.20"));
        b1.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(b1);

        Payment p1 = new Payment();
        p1.setBooking(b1);
        p1.setAmount(b1.getTotalAmount());
        p1.setPaymentMethod(PaymentMethod.CARD);
        p1.setPaymentStatus(PaymentStatus.SUCCESS);
        p1.setTransactionId("TXN-SAMPLE001");
        paymentRepository.save(p1);

        Booking b2 = new Booking();
        b2.setBookingReference("HB-SAMPLE02");
        b2.setCustomer(customer2);
        b2.setHotel(h2);
        b2.setRoom(rooms.get(6)); // Skyline Deluxe
        b2.setCheckInDate(LocalDate.now().plusDays(10));
        b2.setCheckOutDate(LocalDate.now().plusDays(13));
        b2.setNumberOfGuests(2);
        b2.setNumberOfRooms(1);
        b2.setTotalAmount(new BigDecimal("840.00"));
        b2.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(b2);

        Payment p2 = new Payment();
        p2.setBooking(b2);
        p2.setAmount(b2.getTotalAmount());
        p2.setPaymentMethod(PaymentMethod.UPI);
        p2.setPaymentStatus(PaymentStatus.SUCCESS);
        p2.setTransactionId("TXN-SAMPLE002");
        paymentRepository.save(p2);

        logger.info("Sample database records initialized successfully!");
    }

    private Room createRoom(String roomNumber, Hotel hotel, RoomType roomType, BigDecimal price, int capacity, RoomStatus status, String desc, String img) {
        Room r = new Room();
        r.setRoomNumber(roomNumber);
        r.setHotel(hotel);
        r.setRoomType(roomType);
        r.setPrice(price);
        r.setCapacity(capacity);
        r.setStatus(status);
        r.setDescription(desc);
        r.setImageUrl(img);
        return r;
    }
}
