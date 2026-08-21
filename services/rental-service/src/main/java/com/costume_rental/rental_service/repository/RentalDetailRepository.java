package com.costume_rental.rental_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.costume_rental.rental_service.entity.RentalDetail;
import com.costume_rental.rental_service.entity.RentalOrder;

public interface RentalDetailRepository extends JpaRepository<RentalDetail, String> {
    List<RentalDetail> findByRentalOrderIn(List<RentalOrder> rentalOrders);
}
