package com.costume_rental.return_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.costume_rental.return_service.entity.Loi;

@Repository
public interface LoiRepository extends JpaRepository<Loi, String> {
    Page<Loi> findByTenLoiContaining(String tenLoi, Pageable pageable);
}
