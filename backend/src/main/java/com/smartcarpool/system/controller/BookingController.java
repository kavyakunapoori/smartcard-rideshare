package com.smartcarpool.system.controller;

import com.smartcarpool.system.dto.request.BookingCreateRequest;
import com.smartcarpool.system.dto.response.ApiResponse;
import com.smartcarpool.system.dto.response.BookingResponse;
import com.smartcarpool.system.entity.Role;
import com.smartcarpool.system.security.UserPrincipal;
import com.smartcarpool.system.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> bookRide(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BookingCreateRequest request) {
        BookingResponse booking = bookingService.bookRide(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Ride booked successfully", booking), HttpStatus.CREATED);
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponse> bookings = bookingService.getMyBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getRole() == Role.ROLE_ADMIN;
        BookingResponse booking = bookingService.getBookingById(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getRole() == Role.ROLE_ADMIN;
        BookingResponse booking = bookingService.cancelBooking(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
