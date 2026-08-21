package com.costume_rental.customer_service.configuration;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.costume_rental.customer_service.entity.Member;
import com.costume_rental.customer_service.repository.MemberRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(MemberRepository memberRepository) {
        return args -> {
            if (memberRepository.findByUsername("admin").isEmpty()) {

                Member member = Member.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("12345678"))
                        .role("ADMIN")
                        .build();

                memberRepository.save(member);

                log.warn("Admin user created with default password: 12345678");
            }
        };
    }
}
