package com.costume_rental.supplier_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.costume_rental.supplier_service.entity.ImportInvoice;

@Repository
public interface ImportInvoiceRepository extends JpaRepository<ImportInvoice, String> {}
