package com.smartcarpool.system.service;

import com.smartcarpool.system.dto.request.BookingCreateRequest;
import com.smartcarpool.system.dto.response.BookingResponse;
import com.smartcarpool.system.entity.*;
import com.smartcarpool.system.exception.BadRequestException;
import com.smartcarpool.system.exception.ResourceNotFoundException;
import com.smartcarpool.system.exception.UnauthorizedException;
import com.smartcarpool.system.repository.BookingRepository;
import com.smartcarpool.system.repository.RideRepository;
import com.smartcarpool.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RideRepository rideRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse bookRide(Long passengerId, BookingCreateRequest request) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger user not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + request.getRideId()));

        if (ride.getDriver().getId().equals(passengerId)) {
            throw new BadRequestException("You cannot book your own offered ride");
        }

        if (ride.getStatus() != RideStatus.SCHEDULED) {
            throw new BadRequestException("Cannot book a ride that is " + ride.getStatus().name().toLowerCase());
        }

        if (ride.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book a ride that has already departed");
        }

        if (bookingRepository.existsByRideIdAndPassengerIdAndStatus(ride.getId(), passengerId, BookingStatus.CONFIRMED)) {
            throw new BadRequestException("You already have an active confirmed booking for this ride");
        }

        if (ride.getAvailableSeats() < request.getSeatsBooked()) {
            throw new BadRequestException("Insufficient seats available. Requested: " +
                    request.getSeatsBooked() + ", Available: " + ride.getAvailableSeats());
        }

        // Atomically decrement seats
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsBooked());
        rideRepository.save(ride);

        BigDecimal totalPrice = ride.getPricePerSeat().multiply(BigDecimal.valueOf(request.getSeatsBooked()));

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookingNotes(request.getBookingNotes() != null ? request.getBookingNotes().trim() : null);

        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long currentUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isPassenger = booking.getPassenger().getId().equals(currentUserId);
        boolean isDriver = booking.getRide().getDriver().getId().equals(currentUserId);

        if (!isAdmin && !isPassenger && !isDriver) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Restore seats on the ride
        Ride ride = booking.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
        // Ensure available seats does not exceed total seats
        if (ride.getAvailableSeats() > ride.getTotalSeats()) {
            ride.setAvailableSeats(ride.getTotalSeats());
        }
        rideRepository.save(ride);

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return BookingResponse.fromEntity(updatedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long passengerId) {
        return bookingRepository.findByPassengerIdOrderByCreatedAtDesc(passengerId).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long currentUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isPassenger = booking.getPassenger().getId().equals(currentUserId);
        boolean isDriver = booking.getRide().getDriver().getId().equals(currentUserId);

        if (!isAdmin && !isPassenger && !isDriver) {
            throw new UnauthorizedException("You are not authorized to view this booking");
        }

        return BookingResponse.fromEntity(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForRide(Long rideId, Long currentUserId, boolean isAdmin) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!isAdmin && !ride.getDriver().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Only the ride driver or an administrator can view passengers for this ride");
        }

        return bookingRepository.findByRideIdOrderByCreatedAtDesc(rideId).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
