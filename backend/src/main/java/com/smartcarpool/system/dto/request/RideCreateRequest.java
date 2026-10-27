package com.smartcarpool.system.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RideCreateRequest {

    @NotBlank(message = "Source location is required")
    @Size(max = 120, message = "Source location cannot exceed 120 characters")
    private String sourceLocation;

    @NotBlank(message = "Destination location is required")
    @Size(max = 120, message = "Destination location cannot exceed 120 characters")
    private String destinationLocation;

    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time must be in the future")
    private LocalDateTime departureTime;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Ride must have at least 1 seat")
    @Max(value = 8, message = "Ride cannot offer more than 8 seats")
    private Integer totalSeats;

    @NotNull(message = "Price per seat is required")
    @DecimalMin(value = "0.00", message = "Price per seat cannot be negative")
    private BigDecimal pricePerSeat;

    @NotBlank(message = "Vehicle model is required")
    @Size(max = 80, message = "Vehicle model cannot exceed 80 characters")
    private String vehicleModel;

    @Size(max = 30, message = "Vehicle number cannot exceed 30 characters")
    private String vehicleNumber;

    @Size(max = 1000, message = "Travel notes cannot exceed 1000 characters")
    private String travelNotes;

    public RideCreateRequest() {
    }

    public RideCreateRequest(String sourceLocation, String destinationLocation, LocalDateTime departureTime,
                             Integer totalSeats, BigDecimal pricePerSeat, String vehicleModel,
                             String vehicleNumber, String travelNotes) {
        this.sourceLocation = sourceLocation;
        this.destinationLocation = destinationLocation;
        this.departureTime = departureTime;
        this.totalSeats = totalSeats;
        this.pricePerSeat = pricePerSeat;
        this.vehicleModel = vehicleModel;
        this.vehicleNumber = vehicleNumber;
        this.travelNotes = travelNotes;
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
}
