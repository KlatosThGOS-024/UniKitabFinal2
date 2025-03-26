export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public satusCode: number;
  public data?: T;
  constructor(satusCode: number, success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.satusCode = satusCode;
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
