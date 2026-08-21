package com.costume_rental.return_service.entity;

import java.util.List;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "loi")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Loi {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String tenLoi;
    float mucPhat;
    String moTa;

    @OneToMany(mappedBy = "loi", cascade = CascadeType.ALL)
    List<ChiTietLoi> chiTietLois;
}
