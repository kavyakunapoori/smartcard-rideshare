package com.smartcarpool.system.repository;

import com.smartcarpool.system.entity.Booking;
import com.smartcarpool.system.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);

    List<Booking> findByRideIdOrderByCreatedAtDesc(Long rideId);

    List<Booking> findByRideIdAndStatus(Long rideId, BookingStatus status);

    boolean existsByRideIdAndPassengerIdAndStatus(Long rideId, Long passengerId, BookingStatus status);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status = 'CONFIRMED'")
    BigDecimal calculateTotalConfirmedRevenue();
}
