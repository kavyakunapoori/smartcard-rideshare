package com.smartcarpool.system;

import com.smartcarpool.system.dto.request.BookingCreateRequest;
import com.smartcarpool.system.dto.response.BookingResponse;
import com.smartcarpool.system.entity.*;
import com.smartcarpool.system.exception.BadRequestException;
import com.smartcarpool.system.exception.UnauthorizedException;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import com.smartcarpool.system.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User driver;
    private User passenger;
    private Ride ride;
    private Booking booking;

    @BeforeEach
    void setUp() {
        driver = new User(1L, "driver@example.com", "pass", "Driver Dan", "+1 555-0100", Role.ROLE_USER);
        passenger = new User(2L, "passenger@example.com", "pass", "Passenger Pat", "+1 555-0200", Role.ROLE_USER);

        ride = new Ride(
                10L,
                driver,
                "Denver, CO",
                "Boulder, CO",
                LocalDateTime.now().plusDays(1),
                3,
                3,
                new BigDecimal("15.00"),
                "Subaru Outback",
                "CO-5678",
                "Ski rack installed",
                RideStatus.SCHEDULED
        );

        booking = new Booking(
                100L,
                ride,
                passenger,
                2,
                new BigDecimal("30.00"),
                BookingStatus.CONFIRMED,
                "One bag"
        );
    }

    @Test
    @DisplayName("Should successfully book available seats and deduct available count")
    void bookRide_Success() {
        BookingCreateRequest request = new BookingCreateRequest(10L, 2, "One bag");

        when(userRepository.findById(2L)).thenReturn(Optional.of(passenger));
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(bookingRepository.existsByRideIdAndPassengerIdAndStatus(10L, 2L, BookingStatus.CONFIRMED)).thenReturn(false);
        when(rideRepository.save(any(Ride.class))).thenReturn(ride);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        BookingResponse response = bookingService.bookRide(2L, request);

        assertNotNull(response);
        assertEquals(2, response.getSeatsBooked());
        assertEquals(new BigDecimal("30.00"), response.getTotalPrice());
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());

        // Ride available seats should have been reduced to 1
        assertEquals(1, ride.getAvailableSeats());
        verify(rideRepository, times(1)).save(ride);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should reject booking when requested seats exceed available seats")
    void bookRide_InsufficientSeats_ThrowsBadRequest() {
        BookingCreateRequest request = new BookingCreateRequest(10L, 4, "Need 4 seats");

        when(userRepository.findById(2L)).thenReturn(Optional.of(passenger));
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(bookingRepository.existsByRideIdAndPassengerIdAndStatus(10L, 2L, BookingStatus.CONFIRMED)).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.bookRide(2L, request)
        );
        assertTrue(ex.getMessage().contains("Insufficient seats"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should prevent driver from booking their own ride")
    void bookRide_DriverBooksOwnRide_ThrowsBadRequest() {
        BookingCreateRequest request = new BookingCreateRequest(10L, 1, "Self ride");

        when(userRepository.findById(1L)).thenReturn(Optional.of(driver));
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.bookRide(1L, request)
        );
        assertTrue(ex.getMessage().contains("cannot book your own offered ride"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should prevent duplicate confirmed booking for the same ride")
    void bookRide_DuplicateBooking_ThrowsBadRequest() {
        BookingCreateRequest request = new BookingCreateRequest(10L, 1, "Second booking attempt");

        when(userRepository.findById(2L)).thenReturn(Optional.of(passenger));
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(bookingRepository.existsByRideIdAndPassengerIdAndStatus(10L, 2L, BookingStatus.CONFIRMED)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.bookRide(2L, request)
        );
        assertTrue(ex.getMessage().contains("already have an active confirmed booking"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should cancel booking and restore available seats")
    void cancelBooking_Success() {
        ride.setAvailableSeats(1); // Originally had 3, 2 were booked
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(rideRepository.save(any(Ride.class))).thenReturn(ride);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        BookingResponse response = bookingService.cancelBooking(100L, 2L, false);

        assertNotNull(response);
        assertEquals(BookingStatus.CANCELLED, response.getStatus());

        // Restored seats: 1 + 2 = 3
        assertEquals(3, ride.getAvailableSeats());
        verify(rideRepository, times(1)).save(ride);
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    @DisplayName("Should reject booking cancellation by unauthorized user")
    void cancelBooking_Unauthorized_ThrowsException() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThrows(UnauthorizedException.class, () ->
                bookingService.cancelBooking(100L, 999L, false)
        );
    }
}
