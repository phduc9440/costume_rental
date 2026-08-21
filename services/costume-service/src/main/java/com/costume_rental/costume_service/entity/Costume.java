package com.costume_rental.costume_service.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Table(name = "costumes")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Costume {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;

    int quantity;

    float price;
}
