package com.smartcarpool.system.dto.response;

import com.smartcarpool.system.entity.Ride;
import com.smartcarpool.system.entity.RideStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RideResponse {

    private Long id;
    private UserResponse driver;
    private String sourceLocation;
    private String destinationLocation;
    private LocalDateTime departureTime;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal pricePerSeat;
    private String vehicleModel;
    private String vehicleNumber;
    private String travelNotes;
    private RideStatus status;
    private LocalDateTime createdAt;

    public RideResponse() {
    }

    public RideResponse(Long id, UserResponse driver, String sourceLocation, String destinationLocation,
                        LocalDateTime departureTime, Integer totalSeats, Integer availableSeats,
                        BigDecimal pricePerSeat, String vehicleModel, String vehicleNumber,
                        String travelNotes, RideStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.driver = driver;
        this.sourceLocation = sourceLocation;
        this.destinationLocation = destinationLocation;
        this.departureTime = departureTime;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.pricePerSeat = pricePerSeat;
        this.vehicleModel = vehicleModel;
        this.vehicleNumber = vehicleNumber;
        this.travelNotes = travelNotes;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static RideResponse fromEntity(Ride ride) {
        if (ride == null) {
            return null;
        }
        return new RideResponse(
                ride.getId(),
                UserResponse.fromEntity(ride.getDriver()),
                ride.getSourceLocation(),
                ride.getDestinationLocation(),
                ride.getDepartureTime(),
                ride.getTotalSeats(),
                ride.getAvailableSeats(),
                ride.getPricePerSeat(),
                ride.getVehicleModel(),
                ride.getVehicleNumber(),
                ride.getTravelNotes(),
                ride.getStatus(),
                ride.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getDriver() {
        return driver;
    }

    public void setDriver(UserResponse driver) {
        this.driver = driver;
    }

    public String getSourceLocation() {
        return sourceLocation;
    }

    public void setSourceLocation(String sourceLocation) {
        this.sourceLocation = sourceLocation;
    }

    public String getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(String destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(BigDecimal pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getTravelNotes() {
        return travelNotes;
    }

    public void setTravelNotes(String travelNotes) {
        this.travelNotes = travelNotes;
    }

    public RideStatus getStatus() {
        return status;
    }

    public void setStatus(RideStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
