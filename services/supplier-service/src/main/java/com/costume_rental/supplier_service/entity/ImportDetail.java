package com.costume_rental.supplier_service.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "import_details")
public class ImportDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_invoice_id", nullable = false)
    ImportInvoice importInvoice;

    @Column(name = "costume_id", nullable = false)
    String costumeId;

    @Column(nullable = false)
    int quantity;

    @Column(nullable = false)
    double price;
}
