package com.smartcarpool.system.controller;

import com.smartcarpool.system.dto.response.AdminStatsResponse;
import com.smartcarpool.system.dto.response.ApiResponse;
import com.smartcarpool.system.dto.response.RideResponse;
import com.smartcarpool.system.dto.response.UserResponse;
import com.smartcarpool.system.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getPlatformStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Platform statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", users));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<RideResponse>>> getAllRides() {
        List<RideResponse> rides = adminService.getAllRides();
        return ResponseEntity.ok(ApiResponse.success("All rides retrieved", rides));
    }

    @PatchMapping("/rides/{id}/cancel")
    public ResponseEntity<ApiResponse<RideResponse>> cancelRide(@PathVariable Long id) {
        RideResponse response = adminService.cancelRideAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Ride cancelled by administrator", response));
    }
}
