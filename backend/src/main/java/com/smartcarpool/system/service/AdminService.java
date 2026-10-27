package com.smartcarpool.system.service;

import com.smartcarpool.system.dto.response.AdminStatsResponse;
import com.smartcarpool.system.dto.response.RideResponse;
import com.smartcarpool.system.dto.response.UserResponse;
import com.smartcarpool.system.entity.BookingStatus;
import com.smartcarpool.system.entity.RideStatus;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final RideService rideService;

    public AdminService(UserRepository userRepository,
                        RideRepository rideRepository,
                        BookingRepository bookingRepository,
                        UserService userService,
                        RideService rideService) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.rideService = rideService;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalRides = rideRepository.count();
        long activeRides = rideRepository.countByStatus(RideStatus.SCHEDULED);
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        BigDecimal totalRevenue = bookingRepository.calculateTotalConfirmedRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return new AdminStatsResponse(
                totalUsers,
                totalRides,
                activeRides,
                totalBookings,
                confirmedBookings,
                totalRevenue
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @Transactional
    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }

    @Transactional(readOnly = true)
    public List<RideResponse> getAllRides() {
        return rideService.getAllRidesAdmin();
    }

    @Transactional
    public RideResponse cancelRideAdmin(Long rideId) {
        return rideService.cancelRide(rideId, null, true);
    }
}
