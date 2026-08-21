package com.costume_rental.customer_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1002, "You do not have permission", HttpStatus.FORBIDDEN),

    USER_EXISTED(1100, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1101, "User not existed", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(1102, "Username must be at least {min} character", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1103, "Password must be at least {min} character", HttpStatus.BAD_REQUEST),
    PASSWORD_INCORRECT(1104, "Incorrect password", HttpStatus.BAD_REQUEST),

    CUSTOMER_PHONE_EXISTED(1201, "Phone number already exists", HttpStatus.BAD_REQUEST),
    CUSTOMER_EMAIL_EXISTED(1202, "Email already exists", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}
