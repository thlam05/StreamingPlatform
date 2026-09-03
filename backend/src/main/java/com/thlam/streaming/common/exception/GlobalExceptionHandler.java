package com.thlam.streaming.common.exception;

import com.thlam.streaming.common.dtos.ApiErrorResponse;
import com.thlam.streaming.common.dtos.ErrorMeta;
import com.thlam.streaming.common.enums.ApiErrorCode;

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
	ResponseEntity<ApiErrorResponse<Void>> handleNotFound(
			ResourceNotFoundException exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.RESOURCE_NOT_FOUND.getCode(), HttpStatus.NOT_FOUND,
				exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler(ConflictException.class)
	ResponseEntity<ApiErrorResponse<Void>> handleConflict(
			ConflictException exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.CONFLICT.getCode(), HttpStatus.CONFLICT,
				exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	ResponseEntity<ApiErrorResponse<Void>> handleInvalidCredentials(
			InvalidCredentialsException exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.INVALID_REQUEST.getCode(), HttpStatus.BAD_REQUEST,
				exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler(UnauthorizedException.class)
	ResponseEntity<ApiErrorResponse<Void>> handleUnauthorized(
			UnauthorizedException exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.AUTHENTICATION_REQUIRED.getCode(), HttpStatus.UNAUTHORIZED,
				exception.getMessage(), request, Map.of());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ApiErrorResponse<Void>> handleValidation(
			MethodArgumentNotValidException exception,
			HttpServletRequest request) {
		Map<String, String> fieldErrors = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(error -> fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));
		return response(ApiErrorCode.VALIDATION_ERROR.getCode(), HttpStatus.BAD_REQUEST,
				"Request validation failed", request, fieldErrors);
	}

	@ExceptionHandler({
			HttpMessageNotReadableException.class,
			MethodArgumentTypeMismatchException.class
	})
	ResponseEntity<ApiErrorResponse<Void>> handleBadRequest(
			Exception exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.INVALID_REQUEST.getCode(), HttpStatus.BAD_REQUEST,
				"Request is invalid", request, Map.of());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	ResponseEntity<ApiErrorResponse<Void>> handleDataIntegrityViolation(
			DataIntegrityViolationException exception,
			HttpServletRequest request) {
		return response(ApiErrorCode.DATA_INTEGRITY_VIOLATION.getCode(), HttpStatus.CONFLICT,
				"The request conflicts with existing data", request, Map.of());
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ApiErrorResponse<Void>> handleUnexpected(
			Exception exception,
			HttpServletRequest request) {
		LOGGER.error("Unhandled exception while processing {} {}",
				request.getMethod(), request.getRequestURI(), exception);
		return response(ApiErrorCode.INTERNAL_SERVER_ERROR.getCode(), HttpStatus.INTERNAL_SERVER_ERROR,
				"An unexpected error occurred", request, Map.of());
	}

	private ResponseEntity<ApiErrorResponse<Void>> response(
			String code,
			HttpStatus status,
			String message,
			HttpServletRequest request,
			Map<String, String> fieldErrors) {
		ApiErrorResponse<Void> body = new ApiErrorResponse<>(
				code,
				message,
				new ErrorMeta(Instant.now(), status.value(), request.getRequestURI(), fieldErrors));
		return ResponseEntity.status(status).body(body);
	}
}
