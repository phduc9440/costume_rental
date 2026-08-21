package com.costume_rental.return_service.entity;

import java.util.Date;
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
@Table(name = "phieu_tra")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhieuTra {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    Date ngayLap;

    @Column(name = "employee_id")
    String nhanVienId;

    @Column(name = "rental_order_id")
    String phieuThueId;

    @OneToMany(mappedBy = "phieuTra", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ChiTietTra> chiTietTras;
}
