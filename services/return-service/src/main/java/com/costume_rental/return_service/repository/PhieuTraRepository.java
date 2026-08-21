package com.costume_rental.return_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.costume_rental.return_service.entity.PhieuTra;

@Repository
public interface PhieuTraRepository extends JpaRepository<PhieuTra, String> {}
