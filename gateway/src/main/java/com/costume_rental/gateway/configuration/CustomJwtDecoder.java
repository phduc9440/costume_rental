package com.costume_rental.gateway.configuration;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import reactor.core.publisher.Mono;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomJwtDecoder implements ReactiveJwtDecoder {

    NimbusJwtDecoder jwtDecoder;

    public CustomJwtDecoder(@Value("${jwt.signerKey}") String signerKey) {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HmacSHA512");

        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Override
    public Mono<Jwt> decode(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            return Mono.just(jwt);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }
}
