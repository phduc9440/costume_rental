package com.costume_rental.customer_service.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.costume_rental.customer_service.dto.request.AuthenticationRequest;
import com.costume_rental.customer_service.dto.request.CustomerCreationRequest;
import com.costume_rental.customer_service.dto.response.AuthenticationResponse;
import com.costume_rental.customer_service.dto.response.CustomerResponse;
import com.costume_rental.customer_service.entity.Customer;
import com.costume_rental.customer_service.entity.Member;
import com.costume_rental.customer_service.exception.AppException;
import com.costume_rental.customer_service.exception.ErrorCode;
import com.costume_rental.customer_service.mapper.CustomerMapper;
import com.costume_rental.customer_service.repository.MemberRepository;
import com.costume_rental.customer_service.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    MemberRepository memberRepository;
    PasswordEncoder passwordEncoder;
    CustomerMapper customerMapper;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        var user = memberRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }

        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    @Override
    public CustomerResponse register(CustomerCreationRequest request) {
        if (memberRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Customer customer = customerMapper.toCustomer(request);
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setRole("CUSTOMER");

        Customer savedCustomer = memberRepository.save(customer);

        return customerMapper.toCustomerResponse(savedCustomer);
    }

    @Override
    public String generateToken(Member member) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(member.getId())
                .issuer("skin-rental-system")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()))
                .claim("scope", buildScope(member))
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public String buildScope(Member member) {
        if (member.getRole() == null || member.getRole().isBlank()) {
            return "";
        }

        return "ROLE_" + member.getRole().toUpperCase();
    }
}
