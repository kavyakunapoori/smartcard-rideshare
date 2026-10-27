package com.smartcarpool.system.dto.response;

import java.math.BigDecimal;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalRides;
    private long activeRides;
    private long totalBookings;
    private long confirmedBookings;
    private BigDecimal totalRevenue;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalRides, long activeRides,
                              long totalBookings, long confirmedBookings, BigDecimal totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalRides = totalRides;
        this.activeRides = activeRides;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(long totalRides) {
        this.totalRides = totalRides;
    }

    public long getActiveRides() {
        return activeRides;
    }

    public void setActiveRides(long activeRides) {
        this.activeRides = activeRides;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
