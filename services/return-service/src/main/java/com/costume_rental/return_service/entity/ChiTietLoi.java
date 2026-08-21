package com.costume_rental.return_service.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chi_tiet_loi")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietLoi {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    int tongLoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loi_id")
    Loi loi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_tra_id")
    ChiTietTra chiTietTra;
}
