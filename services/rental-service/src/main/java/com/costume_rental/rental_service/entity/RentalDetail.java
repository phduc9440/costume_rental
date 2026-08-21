package com.costume_rental.rental_service.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Table(name = "rental_detail")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RentalDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    int quantity;

    @Column(name = "costume_id")
    String costumeId;

    @ManyToOne
    @JoinColumn(name = "rental_order_id")
    RentalOrder rentalOrder;

    float price;
}
