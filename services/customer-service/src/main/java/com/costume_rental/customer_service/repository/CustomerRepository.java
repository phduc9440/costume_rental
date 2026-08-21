package com.costume_rental.customer_service.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.costume_rental.customer_service.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByPhone(String phone);

    Page<Customer> findByPhoneContaining(String phone, Pageable pageable);

    Page<Customer> findByNameContaining(String name, Pageable pageable);

    boolean existsByPhone(String phone);
}
