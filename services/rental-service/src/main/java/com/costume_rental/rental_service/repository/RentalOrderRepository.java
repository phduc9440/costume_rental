package com.costume_rental.rental_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.costume_rental.rental_service.dto.enums.RentalStatus;
import com.costume_rental.rental_service.entity.RentalOrder;

public interface RentalOrderRepository
        extends JpaRepository<RentalOrder, String>, JpaSpecificationExecutor<RentalOrder> {

    Page<RentalOrder> findByCustomerId(String customerId, Pageable pageable);

    List<RentalOrder> findByStatus(RentalStatus status);

    @Query(
            "SELECT SUM(d.price * d.quantity) FROM RentalDetail d WHERE d.rentalOrder.customerId = :customerId AND d.rentalOrder.status != 'CANCELLED'")
    Double getTotalSpentByCustomerId(@Param("customerId") String customerId);
}
