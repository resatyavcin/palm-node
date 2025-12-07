import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  statusCode: number;
}

interface SuccessParams<T = any> {
  response: Response;
  data: T;
  message?: string;
  statusCode?: number;
}

interface ErrorParams {
  response: Response;
  error: string | Error;
  message?: string;
  statusCode?: number;
}

export class ResponseHelper {
  static success<T>(params: SuccessParams<T>): Response {
    const { response, data, message, statusCode = 200 } = params;

    const apiResponse: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      statusCode,
    };

    return response.status(statusCode).json(apiResponse);
  }

  static error(params: ErrorParams): Response {
    const { response, error, message, statusCode = 500 } = params;
    const errorMessage = error instanceof Error ? error.message : error;

    const apiResponse: ApiResponse = {
      success: false,
      error: errorMessage,
      message,
      timestamp: new Date().toISOString(),
      statusCode,
    };

    return response.status(statusCode).json(apiResponse);
  }

  static badRequest(params: Omit<ErrorParams, "statusCode">): Response {
    return this.error({ ...params, statusCode: 400 });
  }

  static unauthorized(
    params: Omit<ErrorParams, "statusCode"> & { error?: string | Error }
  ): Response {
    return this.error({
      ...params,
      error: params.error || "Unauthorized",
      statusCode: 401,
    });
  }

  static forbidden(
    params: Omit<ErrorParams, "statusCode"> & { error?: string | Error }
  ): Response {
    return this.error({
      ...params,
      error: params.error || "Forbidden",
      statusCode: 403,
    });
  }

  static notFound(
    params: Omit<ErrorParams, "statusCode"> & { error?: string | Error }
  ): Response {
    return this.error({
      ...params,
      error: params.error || "Not Found",
      statusCode: 404,
    });
  }

  static internalServerError(
    params: Omit<ErrorParams, "statusCode">
  ): Response {
    return this.error({ ...params, statusCode: 500 });
  }
}
