package com.smartcarpool.system.controller;

import com.smartcarpool.system.dto.response.ApiResponse;
import com.smartcarpool.system.dto.response.BookingResponse;
import com.smartcarpool.system.entity.Role;
import com.smartcarpool.system.security.UserPrincipal;
import com.smartcarpool.system.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class DriverRideBookingController {

    private final BookingService bookingService;

    public DriverRideBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/{rideId}/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getRideBookings(
            @PathVariable Long rideId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getRole() == Role.ROLE_ADMIN;
        List<BookingResponse> bookings = bookingService.getBookingsForRide(rideId, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Ride bookings retrieved", bookings));
    }
}
