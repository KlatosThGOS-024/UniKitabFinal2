export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(
    success: boolean = false,

    message: string,
    details?: unknown
  ): ApiError {
    return new ApiError(message, 400, details);
  }

  static unauthorized(message: string, details?: unknown): ApiError {
    return new ApiError(message, 401, details);
  }

  static forbidden(message: string, details?: unknown): ApiError {
    return new ApiError(message, 403, details);
  }

  static notFound(message: string, details?: unknown): ApiError {
    return new ApiError(message, 404, details);
  }

  static internal(message: string, details?: unknown): ApiError {
    return new ApiError(message, 500, details);
  }
}
