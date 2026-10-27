package com.smartcarpool.system.dto.response;

import com.smartcarpool.system.entity.Booking;
import com.smartcarpool.system.entity.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private RideResponse ride;
    private UserResponse passenger;
    private Integer seatsBooked;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private String bookingNotes;
    private LocalDateTime createdAt;

    public BookingResponse() {
    }

    public BookingResponse(Long id, RideResponse ride, UserResponse passenger, Integer seatsBooked,
                           BigDecimal totalPrice, BookingStatus status, String bookingNotes,
                           LocalDateTime createdAt) {
        this.id = id;
        this.ride = ride;
        this.passenger = passenger;
        this.seatsBooked = seatsBooked;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookingNotes = bookingNotes;
        this.createdAt = createdAt;
    }

    public static BookingResponse fromEntity(Booking booking) {
        if (booking == null) {
            return null;
        }
        return new BookingResponse(
                booking.getId(),
                RideResponse.fromEntity(booking.getRide()),
                UserResponse.fromEntity(booking.getPassenger()),
                booking.getSeatsBooked(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getBookingNotes(),
                booking.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RideResponse getRide() {
        return ride;
    }

    public void setRide(RideResponse ride) {
        this.ride = ride;
    }

    public UserResponse getPassenger() {
        return passenger;
    }

    public void setPassenger(UserResponse passenger) {
        this.passenger = passenger;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(Integer seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getBookingNotes() {
        return bookingNotes;
    }

    public void setBookingNotes(String bookingNotes) {
        this.bookingNotes = bookingNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
