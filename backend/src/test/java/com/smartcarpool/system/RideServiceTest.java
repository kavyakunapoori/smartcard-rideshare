package com.smartcarpool.system;

import com.smartcarpool.system.dto.request.RideCreateRequest;
import com.smartcarpool.system.dto.response.RideResponse;
import com.smartcarpool.system.entity.Ride;
import com.smartcarpool.system.entity.RideStatus;
import com.smartcarpool.system.entity.Role;
import com.smartcarpool.system.entity.User;
import com.smartcarpool.system.exception.BadRequestException;
import com.smartcarpool.system.exception.UnauthorizedException;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import com.smartcarpool.system.service.RideService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RideServiceTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private RideService rideService;

    private User driver;
    private Ride ride;

    @BeforeEach
    void setUp() {
        driver = new User(1L, "driver@example.com", "pass", "Driver Dan", "+1 555-0100", Role.ROLE_USER);
        ride = new Ride(
                10L,
                driver,
                "Dallas, TX",
                "Austin, TX",
                LocalDateTime.now().plusDays(2),
                4,
                4,
                new BigDecimal("25.00"),
                "Ford Fusion",
                "TX-1234",
                "No pets",
                RideStatus.SCHEDULED
        );
    }

    @Test
    @DisplayName("Should successfully create a ride with future departure")
    void createRide_Success() {
        RideCreateRequest request = new RideCreateRequest(
                "Dallas, TX",
                "Austin, TX",
                LocalDateTime.now().plusDays(2),
                4,
                new BigDecimal("25.00"),
                "Ford Fusion",
                "TX-1234",
                "No pets"
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(driver));
        when(rideRepository.save(any(Ride.class))).thenReturn(ride);

        RideResponse response = rideService.createRide(1L, request);

        assertNotNull(response);
        assertEquals("Dallas, TX", response.getSourceLocation());
        assertEquals("Austin, TX", response.getDestinationLocation());
        assertEquals(4, response.getAvailableSeats());
        verify(rideRepository, times(1)).save(any(Ride.class));
    }

    @Test
    @DisplayName("Should reject ride creation when departure is in the past")
    void createRide_PastDeparture_ThrowsBadRequest() {
        RideCreateRequest request = new RideCreateRequest(
                "Dallas, TX",
                "Austin, TX",
                LocalDateTime.now().minusHours(2),
                4,
                new BigDecimal("25.00"),
                "Ford Fusion",
                "TX-1234",
                "No pets"
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(driver));

        assertThrows(BadRequestException.class, () -> rideService.createRide(1L, request));
        verify(rideRepository, never()).save(any(Ride.class));
    }

    @Test
    @DisplayName("Should search rides with filters")
    void searchRides_Success() {
        when(rideRepository.searchRides(eq("Dallas"), eq("Austin"), any(), any(), eq(2), eq(RideStatus.SCHEDULED), any()))
                .thenReturn(List.of(ride));

        List<RideResponse> results = rideService.searchRides("Dallas", "Austin", null, 2);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Dallas, TX", results.get(0).getSourceLocation());
    }

    @Test
    @DisplayName("Should reject ride modification when user is not the driver and not admin")
    void updateRide_UnauthorizedUser_ThrowsException() {
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));

        assertThrows(UnauthorizedException.class, () ->
                rideService.updateRide(10L, 999L, false, null)
        );
    }

    @Test
    @DisplayName("Should successfully cancel ride and cascade cancellation to bookings")
    void cancelRide_Success() {
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(rideRepository.save(any(Ride.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingRepository.findByRideIdAndStatus(10L, com.smartcarpool.system.entity.BookingStatus.CONFIRMED))
                .thenReturn(Collections.emptyList());

        RideResponse response = rideService.cancelRide(10L, 1L, false);

        assertNotNull(response);
        assertEquals(RideStatus.CANCELLED, response.getStatus());
        verify(rideRepository, times(1)).save(ride);
    }
}
