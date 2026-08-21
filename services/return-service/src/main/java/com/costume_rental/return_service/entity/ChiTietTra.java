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
@Table(name = "chi_tiet_tra")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietTra {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    int soLuong;

    @Column(name = "costume_id")
    String trangPhucId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_tra_id")
    PhieuTra phieuTra;

    @OneToMany(mappedBy = "chiTietTra", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ChiTietLoi> chiTietLois;
}
