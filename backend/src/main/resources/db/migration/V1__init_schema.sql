-- -----------------------------------------------------------------------------
-- V1__init_schema.sql: Initial MySQL schema for Smart Carpool System
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email),
    KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    source_location VARCHAR(120) NOT NULL,
    destination_location VARCHAR(120) NOT NULL,
    departure_time DATETIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price_per_seat DECIMAL(10, 2) NOT NULL,
    vehicle_model VARCHAR(80) NOT NULL,
    vehicle_number VARCHAR(30),
    travel_notes VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    version BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_rides_total_seats CHECK (total_seats >= 1 AND total_seats <= 8),
    CONSTRAINT chk_rides_available_seats CHECK (available_seats >= 0),
    CONSTRAINT chk_rides_price_per_seat CHECK (price_per_seat >= 0),
    CONSTRAINT fk_rides_driver FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_rides_source (source_location),
    KEY idx_rides_destination (destination_location),
    KEY idx_rides_departure (departure_time),
    KEY idx_rides_status (status),
    KEY idx_rides_driver (driver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ride_id BIGINT NOT NULL,
    passenger_id BIGINT NOT NULL,
    seats_booked INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    booking_notes VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_bookings_seats_booked CHECK (seats_booked >= 1),
    CONSTRAINT chk_bookings_total_price CHECK (total_price >= 0),
    CONSTRAINT fk_bookings_ride FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_passenger FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_bookings_ride (ride_id),
    KEY idx_bookings_passenger (passenger_id),
    KEY idx_bookings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
