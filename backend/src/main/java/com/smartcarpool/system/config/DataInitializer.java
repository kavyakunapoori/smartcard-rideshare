package com.smartcarpool.system.config;

import com.smartcarpool.system.entity.*;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RideRepository rideRepository,
                           BookingRepository bookingRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial demo data for Smart Carpool System...");

        // 1. Admin User
        User admin = new User();
        admin.setEmail("admin@carpool.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setFullName("Platform Administrator");
        admin.setPhone("+1 (555) 019-9000");
        admin.setRole(Role.ROLE_ADMIN);
        userRepository.save(admin);

        // 2. Driver 1
        User driverJohn = new User();
        driverJohn.setEmail("john.driver@carpool.com");
        driverJohn.setPassword(passwordEncoder.encode("User@123"));
        driverJohn.setFullName("John Carter");
        driverJohn.setPhone("+1 (555) 014-2231");
        driverJohn.setRole(Role.ROLE_USER);
        userRepository.save(driverJohn);

        // 3. Driver 2
        User driverSarah = new User();
        driverSarah.setEmail("sarah.driver@carpool.com");
        driverSarah.setPassword(passwordEncoder.encode("User@123"));
        driverSarah.setFullName("Sarah Connor");
        driverSarah.setPhone("+1 (555) 018-7744");
        driverSarah.setRole(Role.ROLE_USER);
        userRepository.save(driverSarah);

        // 4. Passenger User
        User passengerAlex = new User();
        passengerAlex.setEmail("alex.rider@carpool.com");
        passengerAlex.setPassword(passwordEncoder.encode("User@123"));
        passengerAlex.setFullName("Alex Rider");
        passengerAlex.setPhone("+1 (555) 012-3456");
        passengerAlex.setRole(Role.ROLE_USER);
        userRepository.save(passengerAlex);

        LocalDateTime now = LocalDateTime.now();

        // 5. Sample Rides
        Ride ride1 = new Ride();
        ride1.setDriver(driverJohn);
        ride1.setSourceLocation("New York, NY");
        ride1.setDestinationLocation("Boston, MA");
        ride1.setDepartureTime(now.plusDays(1).withHour(8).withMinute(30));
        ride1.setTotalSeats(4);
        ride1.setAvailableSeats(4);
        ride1.setPricePerSeat(new BigDecimal("35.00"));
        ride1.setVehicleModel("Toyota Camry (Silver)");
        ride1.setVehicleNumber("NY-CARP-01");
        ride1.setTravelNotes("Leaving from Midtown Manhattan. Non-smoking ride, plenty of trunk space for luggage.");
        ride1.setStatus(RideStatus.SCHEDULED);
        rideRepository.save(ride1);

        Ride ride2 = new Ride();
        ride2.setDriver(driverSarah);
        ride2.setSourceLocation("San Francisco, CA");
        ride2.setDestinationLocation("San Jose, CA");
        ride2.setDepartureTime(now.plusDays(2).withHour(9).withMinute(0));
        ride2.setTotalSeats(3);
        ride2.setAvailableSeats(3);
        ride2.setPricePerSeat(new BigDecimal("18.50"));
        ride2.setVehicleModel("Tesla Model 3 (White)");
        ride2.setVehicleNumber("CA-EV-88");
        ride2.setTravelNotes("Commute along US-101 S. Electric vehicle with climate control and phone chargers available.");
        ride2.setStatus(RideStatus.SCHEDULED);
        rideRepository.save(ride2);

        Ride ride3 = new Ride();
        ride3.setDriver(driverJohn);
        ride3.setSourceLocation("Austin, TX");
        ride3.setDestinationLocation("Houston, TX");
        ride3.setDepartureTime(now.plusDays(3).withHour(14).withMinute(0));
        ride3.setTotalSeats(4);
        ride3.setAvailableSeats(4);
        ride3.setPricePerSeat(new BigDecimal("28.00"));
        ride3.setVehicleModel("Honda Accord (Black)");
        ride3.setVehicleNumber("TX-RIDE-42");
        ride3.setTravelNotes("Stopping at Katy Mills Mall on the way. Air conditioning and music on request.");
        ride3.setStatus(RideStatus.SCHEDULED);
        rideRepository.save(ride3);

        Ride ride4 = new Ride();
        ride4.setDriver(driverSarah);
        ride4.setSourceLocation("Seattle, WA");
        ride4.setDestinationLocation("Portland, OR");
        ride4.setDepartureTime(now.plusDays(4).withHour(10).withMinute(15));
        ride4.setTotalSeats(3);
        ride4.setAvailableSeats(2); // 1 seat booked by Alex
        ride4.setPricePerSeat(new BigDecimal("30.00"));
        ride4.setVehicleModel("Hyundai Ioniq 5 (Blue)");
        ride4.setVehicleNumber("WA-GREEN-9");
        ride4.setTravelNotes("Scenic drive down I-5. Quiet ride, podcasts or relaxed conversation welcome.");
        ride4.setStatus(RideStatus.SCHEDULED);
        Ride savedRide4 = rideRepository.save(ride4);

        // 6. Sample Booking for Alex on Ride 4
        Booking booking = new Booking();
        booking.setRide(savedRide4);
        booking.setPassenger(passengerAlex);
        booking.setSeatsBooked(1);
        booking.setTotalPrice(new BigDecimal("30.00"));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookingNotes("I will bring one carry-on backpack.");
        bookingRepository.save(booking);

        log.info("Demo data seeding completed successfully!");
        log.info("Admin: admin@carpool.com / Admin@123");
        log.info("Driver: john.driver@carpool.com / User@123");
        log.info("Passenger: alex.rider@carpool.com / User@123");
    }
}
