package com.smartcarpool.system.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookingCreateRequest {

    @NotNull(message = "Ride ID is required")
    private Long rideId;

    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "You must book at least 1 seat")
    @Max(value = 8, message = "You cannot book more than 8 seats in one request")
    private Integer seatsBooked;

    @Size(max = 500, message = "Booking notes cannot exceed 500 characters")
    private String bookingNotes;

    public BookingCreateRequest() {
    }

    public BookingCreateRequest(Long rideId, Integer seatsBooked, String bookingNotes) {
        this.rideId = rideId;
        this.seatsBooked = seatsBooked;
        this.bookingNotes = bookingNotes;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(Integer seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public String getBookingNotes() {
        return bookingNotes;
    }

    public void setBookingNotes(String bookingNotes) {
        this.bookingNotes = bookingNotes;
    }
}
