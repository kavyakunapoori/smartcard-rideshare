package com.smartcarpool.system.dto.request;

import com.smartcarpool.system.entity.RideStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RideUpdateRequest {

    @Future(message = "Departure time must be in the future")
    private LocalDateTime departureTime;

    @DecimalMin(value = "0.00", message = "Price per seat cannot be negative")
    private BigDecimal pricePerSeat;

    @Size(max = 80, message = "Vehicle model cannot exceed 80 characters")
    private String vehicleModel;

    @Size(max = 30, message = "Vehicle number cannot exceed 30 characters")
    private String vehicleNumber;

    @Size(max = 1000, message = "Travel notes cannot exceed 1000 characters")
    private String travelNotes;

    private RideStatus status;

    public RideUpdateRequest() {
    }

    public RideUpdateRequest(LocalDateTime departureTime, BigDecimal pricePerSeat, String vehicleModel,
                              String vehicleNumber, String travelNotes, RideStatus status) {
        this.departureTime = departureTime;
        this.pricePerSeat = pricePerSeat;
        this.vehicleModel = vehicleModel;
        this.vehicleNumber = vehicleNumber;
        this.travelNotes = travelNotes;
        this.status = status;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
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
}
