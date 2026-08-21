package com.costume_rental.customer_service.service;

import com.costume_rental.customer_service.dto.request.AuthenticationRequest;
import com.costume_rental.customer_service.dto.request.CustomerCreationRequest;
import com.costume_rental.customer_service.dto.response.AuthenticationResponse;
import com.costume_rental.customer_service.dto.response.CustomerResponse;
import com.costume_rental.customer_service.entity.Member;

public interface AuthenticationService {
    AuthenticationResponse login(AuthenticationRequest request);

    CustomerResponse register(CustomerCreationRequest request);

    String generateToken(Member member);

    String buildScope(Member member);
}
