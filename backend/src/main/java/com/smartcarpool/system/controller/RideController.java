package com.smartcarpool.system.controller;

import com.smartcarpool.system.dto.request.RideCreateRequest;
import com.smartcarpool.system.dto.request.RideUpdateRequest;
import com.smartcarpool.system.dto.response.ApiResponse;
import com.smartcarpool.system.dto.response.RideResponse;
import com.smartcarpool.system.entity.Role;
import com.smartcarpool.system.security.UserPrincipal;
import com.smartcarpool.system.service.RideService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RideResponse>>> searchRides(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer minSeats) {
        List<RideResponse> rides = rideService.searchRides(source, destination, date, minSeats);
        return ResponseEntity.ok(ApiResponse.success("Rides retrieved successfully", rides));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RideResponse>> getRideById(@PathVariable Long id) {
        RideResponse ride = rideService.getRideById(id);
        return ResponseEntity.ok(ApiResponse.success("Ride details retrieved", ride));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RideResponse>> createRide(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody RideCreateRequest request) {
        RideResponse ride = rideService.createRide(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Ride published successfully", ride), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RideResponse>> updateRide(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody RideUpdateRequest request) {
        boolean isAdmin = userPrincipal.getRole() == Role.ROLE_ADMIN;
        RideResponse ride = rideService.updateRide(id, userPrincipal.getId(), isAdmin, request);
        return ResponseEntity.ok(ApiResponse.success("Ride updated successfully", ride));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<RideResponse>> cancelRide(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getRole() == Role.ROLE_ADMIN;
        RideResponse ride = rideService.cancelRide(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Ride cancelled successfully", ride));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<RideResponse>>> getMyRides(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RideResponse> rides = rideService.getMyOfferedRides(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Offered rides retrieved successfully", rides));
    }
}
