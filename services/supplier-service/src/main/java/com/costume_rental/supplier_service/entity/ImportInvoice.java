package com.costume_rental.supplier_service.entity;

import java.time.LocalDateTime;
import java.util.List;

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
@Table(name = "import_invoices")
public class ImportInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    Supplier supplier;

    @Column(name = "employee_id", nullable = false)
    String employeeId;

    @Column(name = "import_date")
    LocalDateTime importDate;

    @Column(name = "total_amount")
    double totalAmount;

    @OneToMany(mappedBy = "importInvoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ImportDetail> importDetails;
}
