package com.thlam.streaming.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiErrorResponse> handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request) {
        return response(HttpStatus.NOT_FOUND, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiErrorResponse> handleConflict(
            ConflictException exception,
            HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return response(HttpStatus.BAD_REQUEST, "Request validation failed", request, fieldErrors);
    }

    @ExceptionHandler({
            HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class
    })
    ResponseEntity<ApiErrorResponse> handleBadRequest(
            Exception exception,
            HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "Request is invalid", request, Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "The request conflicts with existing data", request, Map.of());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiErrorResponse> handleUnexpected(
            Exception exception,
            HttpServletRequest request) {
        LOGGER.error("Unhandled exception while processing {} {}", request.getMethod(), request.getRequestURI(), exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request, Map.of());
    }

    private ResponseEntity<ApiErrorResponse> response(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> fieldErrors) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                message,
                request.getRequestURI(),
                fieldErrors);
        return ResponseEntity.status(status).body(body);
    }
}
