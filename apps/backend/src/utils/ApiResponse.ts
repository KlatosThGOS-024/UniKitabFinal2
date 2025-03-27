export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public statusCode: number;
  public data?: T;
  constructor(statusCode: number, success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
  static success<T>(
    statusCode: number,
    message: string,
    data?: T
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, true, message, data);
  }
  static failure<T>(
    statusCode: number,
    message: string,
    data?: T
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, false, message, data);
  }
}
