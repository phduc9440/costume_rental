package com.costume_rental.costume_service.configuration;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.costume_rental.costume_service.entity.Costume;
import com.costume_rental.costume_service.repository.CostumeRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {
    CostumeRepository costumeRepository;

    @Override
    public void run(String... args) throws Exception {
        if (costumeRepository.count() == 0) {
            log.info("Database is empty. Seeding initial costumes...");

            List<Costume> initialCostumes = List.of(
                    Costume.builder()
                            .name("Traditional Ao Dai")
                            .quantity(10)
                            .price(150000.0f)
                            .build(),
                    Costume.builder()
                            .name("Modern Ao Dai")
                            .quantity(5)
                            .price(200000.0f)
                            .build(),
                    Costume.builder()
                            .name("Wedding Ao Dai")
                            .quantity(2)
                            .price(500000.0f)
                            .build(),
                    Costume.builder()
                            .name("Student Uniform")
                            .quantity(20)
                            .price(50000.0f)
                            .build(),
                    Costume.builder()
                            .name("Vintage Dress")
                            .quantity(8)
                            .price(300000.0f)
                            .build());

            costumeRepository.saveAll(initialCostumes);
            log.info("Seeded {} costumes successfully.", initialCostumes.size());
        } else {
            log.info("Database already contains data. Skipping costumes seeding.");
        }
    }
}
