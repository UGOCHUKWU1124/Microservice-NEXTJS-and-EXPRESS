export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>; // 👈 always an object
  public readonly errorCode: string;

  constructor(
    message: string,
    statusCode: number,
    errorCode = "APP_ERROR",
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.errorCode = errorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      success: false,
      errorCode: this.errorCode,
      message: this.message,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: Record<string, any>) {
    super(message, 404, "NOT_FOUND", true, details);
  }
}

// Validation Error
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: Record<string, any>) {
    super(message, 400, "VALIDATION_ERROR", true, details);
  }
}

// Authentication Error
export class AuthError extends AppError {
  constructor(message = "Unauthorized", details?: Record<string, any>) {
    super(message, 401, "AUTH_ERROR", true, details);
  }
}

// Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access", details?: Record<string, any>) {
    super(message, 403, "FORBIDDEN", true, details);
  }
}

// Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: Record<string, any>) {
    super(message, 500, "DATABASE_ERROR", true, details);
  }
}

// Rate Limit Error
export class RateLimitError extends AppError {
  constructor(
    message = "Too many requests, please try again later",
    details?: Record<string, any>
  ) {
    super(message, 429, "RATE_LIMIT", true, details);
  }
}
