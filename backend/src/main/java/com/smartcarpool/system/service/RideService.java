package com.smartcarpool.system.service;

import com.smartcarpool.system.dto.request.RideCreateRequest;
import com.smartcarpool.system.dto.request.RideUpdateRequest;
import com.smartcarpool.system.dto.response.RideResponse;
import com.smartcarpool.system.entity.*;
import com.smartcarpool.system.exception.BadRequestException;
import com.smartcarpool.system.exception.ResourceNotFoundException;
import com.smartcarpool.system.exception.UnauthorizedException;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public RideService(RideRepository rideRepository,
                       UserRepository userRepository,
                       BookingRepository bookingRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public RideResponse createRide(Long driverId, RideCreateRequest request) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver user not found"));

        if (request.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Departure time cannot be in the past");
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSourceLocation(request.getSourceLocation().trim());
        ride.setDestinationLocation(request.getDestinationLocation().trim());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setTotalSeats(request.getTotalSeats());
        ride.setAvailableSeats(request.getTotalSeats());
        ride.setPricePerSeat(request.getPricePerSeat());
        ride.setVehicleModel(request.getVehicleModel().trim());
        ride.setVehicleNumber(request.getVehicleNumber() != null ? request.getVehicleNumber().trim() : null);
        ride.setTravelNotes(request.getTravelNotes() != null ? request.getTravelNotes().trim() : null);
        ride.setStatus(RideStatus.SCHEDULED);

        Ride saved = rideRepository.save(ride);
        return RideResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<RideResponse> searchRides(String source, String destination, LocalDate date, Integer minSeats) {
        LocalDateTime startTime = null;
        LocalDateTime endTime = null;

        if (date != null) {
            startTime = date.atStartOfDay();
            endTime = date.atTime(LocalTime.MAX);
        }

        LocalDateTime now = LocalDateTime.now();
        List<Ride> rides = rideRepository.searchRides(
                source != null && !source.isBlank() ? source.trim() : null,
                destination != null && !destination.isBlank() ? destination.trim() : null,
                startTime,
                endTime,
                minSeats != null ? minSeats : 1,
                RideStatus.SCHEDULED,
                now
        );

        return rides.stream()
                .map(RideResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RideResponse getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));
        return RideResponse.fromEntity(ride);
    }

    @Transactional(readOnly = true)
    public List<RideResponse> getMyOfferedRides(Long driverId) {
        return rideRepository.findByDriverIdOrderByDepartureTimeDesc(driverId).stream()
                .map(RideResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RideResponse updateRide(Long rideId, Long currentUserId, boolean isAdmin, RideUpdateRequest request) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!isAdmin && !ride.getDriver().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to update this ride");
        }

        if (ride.getStatus() == RideStatus.CANCELLED || ride.getStatus() == RideStatus.COMPLETED) {
            throw new BadRequestException("Cannot update a ride that has been cancelled or completed");
        }

        if (request.getDepartureTime() != null) {
            if (request.getDepartureTime().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("New departure time cannot be in the past");
            }
            ride.setDepartureTime(request.getDepartureTime());
        }

        if (request.getPricePerSeat() != null) {
            ride.setPricePerSeat(request.getPricePerSeat());
        }

        if (request.getVehicleModel() != null && !request.getVehicleModel().isBlank()) {
            ride.setVehicleModel(request.getVehicleModel().trim());
        }

        if (request.getVehicleNumber() != null) {
            ride.setVehicleNumber(request.getVehicleNumber().trim());
        }

        if (request.getTravelNotes() != null) {
            ride.setTravelNotes(request.getTravelNotes().trim());
        }

        if (request.getStatus() != null) {
            ride.setStatus(request.getStatus());
        }

        Ride updated = rideRepository.save(ride);
        return RideResponse.fromEntity(updated);
    }

    @Transactional
    public RideResponse cancelRide(Long rideId, Long currentUserId, boolean isAdmin) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!isAdmin && !ride.getDriver().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to cancel this ride");
        }

        if (ride.getStatus() == RideStatus.CANCELLED) {
            throw new BadRequestException("Ride is already cancelled");
        }

        ride.setStatus(RideStatus.CANCELLED);
        Ride updated = rideRepository.save(ride);

        // Cancel all active bookings associated with this cancelled ride
        List<Booking> activeBookings = bookingRepository.findByRideIdAndStatus(rideId, BookingStatus.CONFIRMED);
        for (Booking booking : activeBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }

        return RideResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<RideResponse> getAllRidesAdmin() {
        return rideRepository.findAll().stream()
                .map(RideResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
