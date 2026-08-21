package com.costume_rental.rental_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.costume_rental.rental_service.dto.enums.RentalStatus;
import com.costume_rental.rental_service.dto.enums.RentalType;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Table(name = "rental_orders")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RentalOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    LocalDateTime createDate;

    @Enumerated(EnumType.STRING)
    RentalType type;

    @Enumerated(EnumType.STRING)
    RentalStatus status;

    @Column(name = "customer_id")
    String customerId;

    @Column(name = "employee_id")
    String employeeId;

    @Column(name = "cancel_reason")
    String cancelReason;

    LocalDateTime dueDate;
}
