package com.costume_rental.rental_service.dto.enums;

public enum RentalStatus {
    PENDING,
    CONFIRMED,
    DEPOSIT_PAID, // Đã thanh toán tiền cọc
    RENTING, // Đang mượn đồ / đang thuê
    CANCELLED,
    COMPLETED // Trả đồ và hoàn thành
}
