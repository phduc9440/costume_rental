package com.costume_rental.customer_service.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Table(name = "customers")
@PrimaryKeyJoinColumn(name = "member_id")
@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer extends Member {
    String name;

    @Column(unique = true)
    String phone;

    String address;
    String email;
}
