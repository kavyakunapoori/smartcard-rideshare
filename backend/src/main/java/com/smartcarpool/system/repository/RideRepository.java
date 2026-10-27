package com.smartcarpool.system.repository;

import com.smartcarpool.system.entity.Ride;
import com.smartcarpool.system.entity.RideStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByDriverIdOrderByDepartureTimeDesc(Long driverId);

    @Query("SELECT r FROM Ride r WHERE " +
           "(:source IS NULL OR LOWER(r.sourceLocation) LIKE LOWER(CONCAT('%', :source, '%'))) AND " +
           "(:destination IS NULL OR LOWER(r.destinationLocation) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:startTime IS NULL OR r.departureTime >= :startTime) AND " +
           "(:endTime IS NULL OR r.departureTime <= :endTime) AND " +
           "(:minSeats IS NULL OR r.availableSeats >= :minSeats) AND " +
           "r.status = :status AND " +
           "r.departureTime > :now " +
           "ORDER BY r.departureTime ASC")
    List<Ride> searchRides(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("minSeats") Integer minSeats,
            @Param("status") RideStatus status,
            @Param("now") LocalDateTime now
    );

    @Query("SELECT r FROM Ride r WHERE r.status = 'SCHEDULED' AND r.departureTime > :now ORDER BY r.departureTime ASC")
    List<Ride> findUpcomingRides(@Param("now") LocalDateTime now, Pageable pageable);

    long countByStatus(RideStatus status);
}
