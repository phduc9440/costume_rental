package com.costume_rental.costume_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.costume_rental.costume_service.entity.Costume;

public interface CostumeRepository extends JpaRepository<Costume, String> {
    List<Costume> findByIdIn(List<String> ids);
}
